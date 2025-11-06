mod commands;

use commands::*;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      load_spectrum
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
