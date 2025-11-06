// Provides serialization and deserialization so this struct
// can be sent to the frontend via Tauri (as JSON).
use serde::{Serialize, Deserialize};

// Modern, high-performance DataFrame and CSV reader.
use polars::prelude::*;

// Represents a loaded spectrum from a CSV file.
// - `x`: horizontal axis (e.g., wavelength, m/z, time, etc.)
// - `y`: intensity values
// - `peaks`: peak indices with their intensities
#[derive(Serialize, Deserialize)]
pub struct Spectrum {
    pub x: Vec<f32>,
    pub y: Vec<f32>,
    pub peaks: Vec<(usize, f32)>,
}

// A Tauri command that can be invoked from the frontend (React/JS).
// `path`: absolute file path selected by the user.
#[tauri::command]
pub fn load_spectrum(path: String) -> Result<Spectrum, String> {
    // Read the CSV using Polars.
    // `map_err` converts any internal error into a String
    // so we can return it cleanly to the UI.
    let df = CsvReader::from_path(path)
        .map_err(|e| e.to_string())?
        .finish()
        .map_err(|e| e.to_string())?;

    // Extract column "x" as f32 values.
   .unwrap() will panic if the column is missing;
    // this can be improved later with friendlier errors.
    let x = df.column("x").unwrap().f32().unwrap().into_no_null_iter().collect();

    // Extract column "y" (intensities).
    let y = df.column("y").unwrap().f32().unwrap().into_no_null_iter().collect();

    // Storage for detected peaks.
    // Currently uses a simple local maximum approach.
    let mut peaks = Vec::new();

    // Iterate through all values except the boundaries.
    for i in 1..y.len()-1 {
        // Detect a peak when the intensity is greater than the
        // immediate neighbors on both sides.
        if y[i] > y[i-1] && y[i] > y[i+1] {
            peaks.push((i, y[i]));
        }
    }

    Ok(Spectrum { x, y, peaks })
}
