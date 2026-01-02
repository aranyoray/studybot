"""
Hybrid CNN + LSTM Model for Engagement Monitoring
- CNN for eye tracking scanpath/velocity analysis
- LSTM for audio MFCC time-series analysis
- Ensemble fusion for final engagement prediction
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from typing import Dict, List, Tuple, Optional
import json


class HybridEngagementModel:
    """
    Hybrid model combining:
    1. CNN for visual scanpath analysis (eye tracking)
    2. LSTM for audio features (MFCC time series)
    3. Ensemble layer for final predictions
    """

    def __init__(
        self,
        scanpath_shape: Tuple[int, int, int] = (50, 50, 3),  # Height, Width, Channels
        mfcc_shape: Tuple[int, int] = (100, 13),  # Timesteps, MFCC coefficients
        num_classes: int = 4,  # high, medium, low, critical engagement
    ):
        self.scanpath_shape = scanpath_shape
        self.mfcc_shape = mfcc_shape
        self.num_classes = num_classes

        self.cnn_model = None
        self.lstm_model = None
        self.hybrid_model = None

    def build_cnn_model(self) -> keras.Model:
        """
        Build CNN for scanpath/velocity map analysis
        Input: Scanpath image (heatmap + velocity overlay)
        Output: Engagement features
        """
        inputs = keras.Input(shape=self.scanpath_shape, name="scanpath_input")

        # Convolutional layers
        x = layers.Conv2D(32, (3, 3), activation="relu", padding="same")(inputs)
        x = layers.MaxPooling2D((2, 2))(x)
        x = layers.Dropout(0.2)(x)

        x = layers.Conv2D(64, (3, 3), activation="relu", padding="same")(x)
        x = layers.MaxPooling2D((2, 2))(x)
        x = layers.Dropout(0.2)(x)

        x = layers.Conv2D(128, (3, 3), activation="relu", padding="same")(x)
        x = layers.MaxPooling2D((2, 2))(x)
        x = layers.Dropout(0.3)(x)

        # Flatten and dense layers
        x = layers.Flatten()(x)
        x = layers.Dense(256, activation="relu")(x)
        x = layers.Dropout(0.4)(x)

        # Output features for ensemble
        cnn_features = layers.Dense(128, activation="relu", name="cnn_features")(x)

        model = keras.Model(inputs=inputs, outputs=cnn_features, name="cnn_scanpath")
        return model

    def build_lstm_model(self) -> keras.Model:
        """
        Build LSTM for MFCC audio time-series analysis
        Input: MFCC features over time
        Output: Engagement features
        """
        inputs = keras.Input(shape=self.mfcc_shape, name="mfcc_input")

        # LSTM layers
        x = layers.LSTM(128, return_sequences=True, dropout=0.2, recurrent_dropout=0.2)(inputs)
        x = layers.LSTM(64, return_sequences=False, dropout=0.2, recurrent_dropout=0.2)(x)

        # Dense layers
        x = layers.Dense(128, activation="relu")(x)
        x = layers.Dropout(0.3)(x)

        # Output features for ensemble
        lstm_features = layers.Dense(128, activation="relu", name="lstm_features")(x)

        model = keras.Model(inputs=inputs, outputs=lstm_features, name="lstm_audio")
        return model

    def build_hybrid_model(self) -> keras.Model:
        """
        Build hybrid ensemble model combining CNN and LSTM
        """
        # Build component models
        self.cnn_model = self.build_cnn_model()
        self.lstm_model = self.build_lstm_model()

        # Define inputs
        scanpath_input = keras.Input(shape=self.scanpath_shape, name="scanpath_input")
        mfcc_input = keras.Input(shape=self.mfcc_shape, name="mfcc_input")

        # Get features from each model
        cnn_features = self.cnn_model(scanpath_input)
        lstm_features = self.lstm_model(mfcc_input)

        # Concatenate features
        combined = layers.Concatenate()([cnn_features, lstm_features])

        # Fusion layers
        x = layers.Dense(256, activation="relu")(combined)
        x = layers.Dropout(0.4)(x)
        x = layers.Dense(128, activation="relu")(x)
        x = layers.Dropout(0.3)(x)

        # Output layers
        # Main output: engagement classification
        engagement_output = layers.Dense(
            self.num_classes, activation="softmax", name="engagement_class"
        )(x)

        # Auxiliary outputs for monitoring
        attention_output = layers.Dense(1, activation="sigmoid", name="attention_score")(x)
        frustration_output = layers.Dense(1, activation="sigmoid", name="frustration_level")(x)

        # Build model
        model = keras.Model(
            inputs=[scanpath_input, mfcc_input],
            outputs={
                "engagement_class": engagement_output,
                "attention_score": attention_output,
                "frustration_level": frustration_output,
            },
            name="hybrid_engagement_model",
        )

        return model

    def compile_model(
        self,
        learning_rate: float = 0.001,
        loss_weights: Optional[Dict[str, float]] = None,
    ):
        """Compile the hybrid model with appropriate losses and metrics"""
        if self.hybrid_model is None:
            self.hybrid_model = self.build_hybrid_model()

        if loss_weights is None:
            loss_weights = {
                "engagement_class": 1.0,
                "attention_score": 0.5,
                "frustration_level": 0.5,
            }

        self.hybrid_model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
            loss={
                "engagement_class": "categorical_crossentropy",
                "attention_score": "binary_crossentropy",
                "frustration_level": "binary_crossentropy",
            },
            loss_weights=loss_weights,
            metrics={
                "engagement_class": ["accuracy"],
                "attention_score": ["mae"],
                "frustration_level": ["mae"],
            },
        )

        return self.hybrid_model

    def train(
        self,
        scanpath_data: np.ndarray,
        mfcc_data: np.ndarray,
        engagement_labels: np.ndarray,
        attention_labels: np.ndarray,
        frustration_labels: np.ndarray,
        validation_split: float = 0.2,
        epochs: int = 50,
        batch_size: int = 32,
    ):
        """
        Train the hybrid model

        Args:
            scanpath_data: Array of scanpath images (N, H, W, C)
            mfcc_data: Array of MFCC sequences (N, T, F)
            engagement_labels: One-hot encoded engagement classes (N, num_classes)
            attention_labels: Attention scores (N, 1)
            frustration_labels: Frustration levels (N, 1)
        """
        if self.hybrid_model is None:
            self.compile_model()

        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor="val_loss", patience=10, restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor="val_loss", factor=0.5, patience=5, min_lr=1e-7
            ),
            keras.callbacks.ModelCheckpoint(
                filepath="models/hybrid_engagement_best.h5",
                monitor="val_engagement_class_accuracy",
                save_best_only=True,
            ),
        ]

        history = self.hybrid_model.fit(
            x={"scanpath_input": scanpath_data, "mfcc_input": mfcc_data},
            y={
                "engagement_class": engagement_labels,
                "attention_score": attention_labels,
                "frustration_level": frustration_labels,
            },
            validation_split=validation_split,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=1,
        )

        return history

    def predict(
        self,
        scanpath_data: np.ndarray,
        mfcc_data: np.ndarray,
    ) -> Dict[str, np.ndarray]:
        """
        Make predictions on new data

        Returns:
            Dictionary with engagement_class, attention_score, frustration_level
        """
        if self.hybrid_model is None:
            raise ValueError("Model not built or loaded")

        predictions = self.hybrid_model.predict(
            {"scanpath_input": scanpath_data, "mfcc_input": mfcc_data}
        )

        return predictions

    def save(self, path: str = "models/hybrid_engagement_model"):
        """Save the trained model"""
        if self.hybrid_model is None:
            raise ValueError("No model to save")

        self.hybrid_model.save(f"{path}.h5")

        # Save model config
        config = {
            "scanpath_shape": self.scanpath_shape,
            "mfcc_shape": self.mfcc_shape,
            "num_classes": self.num_classes,
        }

        with open(f"{path}_config.json", "w") as f:
            json.dump(config, f)

        print(f"Model saved to {path}")

    def load(self, path: str = "models/hybrid_engagement_model"):
        """Load a trained model"""
        try:
            self.hybrid_model = keras.models.load_model(f"{path}.h5")

            # Load config
            with open(f"{path}_config.json", "r") as f:
                config = json.load(f)
                self.scanpath_shape = tuple(config["scanpath_shape"])
                self.mfcc_shape = tuple(config["mfcc_shape"])
                self.num_classes = config["num_classes"]

            print(f"Model loaded from {path}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def get_model_summary(self):
        """Print model architecture summary"""
        if self.hybrid_model is None:
            self.hybrid_model = self.build_hybrid_model()

        print("\n=== CNN Model (Scanpath Analysis) ===")
        self.cnn_model.summary()

        print("\n=== LSTM Model (Audio Analysis) ===")
        self.lstm_model.summary()

        print("\n=== Hybrid Ensemble Model ===")
        self.hybrid_model.summary()


def preprocess_scanpath(
    fixations: List[Dict],
    saccades: List[Dict],
    screen_width: int = 1920,
    screen_height: int = 1080,
    grid_size: int = 50,
) -> np.ndarray:
    """
    Convert scanpath data to image representation for CNN

    Returns:
        3-channel image: (heatmap, fixation duration map, velocity map)
    """
    image = np.zeros((grid_size, grid_size, 3))

    cell_width = screen_width / grid_size
    cell_height = screen_height / grid_size

    # Channel 0: Heatmap (gaze points)
    for fix in fixations:
        x = int(min(fix["x"] / cell_width, grid_size - 1))
        y = int(min(fix["y"] / cell_height, grid_size - 1))
        image[y, x, 0] += 1

    # Channel 1: Fixation duration
    for fix in fixations:
        x = int(min(fix["x"] / cell_width, grid_size - 1))
        y = int(min(fix["y"] / cell_height, grid_size - 1))
        image[y, x, 1] += fix["duration"] / 1000  # normalize

    # Channel 2: Saccade velocity
    for sacc in saccades:
        x = int(min(sacc["toX"] / cell_width, grid_size - 1))
        y = int(min(sacc["toY"] / cell_height, grid_size - 1))
        image[y, x, 2] += sacc["velocity"] / 100  # normalize

    # Normalize each channel
    for c in range(3):
        max_val = image[:, :, c].max()
        if max_val > 0:
            image[:, :, c] /= max_val

    return image


def preprocess_mfcc(
    mfcc_features: List[List[float]],
    target_length: int = 100,
) -> np.ndarray:
    """
    Preprocess MFCC features for LSTM

    Pads or truncates to target_length timesteps
    """
    mfcc_array = np.array(mfcc_features)

    if len(mfcc_array) == 0:
        return np.zeros((target_length, 13))

    if len(mfcc_array) < target_length:
        # Pad with zeros
        padding = np.zeros((target_length - len(mfcc_array), mfcc_array.shape[1]))
        mfcc_array = np.vstack([mfcc_array, padding])
    elif len(mfcc_array) > target_length:
        # Truncate
        mfcc_array = mfcc_array[:target_length]

    # Normalize
    mean = mfcc_array.mean(axis=0)
    std = mfcc_array.std(axis=0)
    mfcc_array = (mfcc_array - mean) / (std + 1e-8)

    return mfcc_array


if __name__ == "__main__":
    # Example usage
    model = HybridEngagementModel(
        scanpath_shape=(50, 50, 3),
        mfcc_shape=(100, 13),
        num_classes=4,
    )

    model.get_model_summary()

    # Example training data (replace with real data)
    n_samples = 100
    scanpath_data = np.random.rand(n_samples, 50, 50, 3)
    mfcc_data = np.random.rand(n_samples, 100, 13)
    engagement_labels = np.eye(4)[np.random.randint(0, 4, n_samples)]
    attention_labels = np.random.rand(n_samples, 1)
    frustration_labels = np.random.rand(n_samples, 1)

    # Compile and train
    model.compile_model()

    # Uncomment to train:
    # history = model.train(
    #     scanpath_data,
    #     mfcc_data,
    #     engagement_labels,
    #     attention_labels,
    #     frustration_labels,
    #     epochs=10,
    #     batch_size=16,
    # )

    # Save model
    # model.save("models/hybrid_engagement_model")

    print("\nHybrid model structure created successfully!")
