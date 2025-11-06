import { useState } from "react";
// @ts-ignore
import Plot from "react-plotly.js";
import PeaksTable from "../components/PeaksTable";
import { invoke } from "@tauri-apps/api/core";
// @ts-ignore
import { open } from "@tauri-apps/plugin-dialog";

export default function SpectrumView() {
  const [x, setX] = useState<number[]>([]);
  const [y, setY] = useState<number[]>([]);
  const [peaks, setPeaks] = useState<{ index: number; intensity: number }[]>([]);
  const [filename, setFilename] = useState("");

  async function handleLoad() {
    const file = await open({
      filters: [{ name: "CSV", extensions: ["csv"] }],
    });
    if (!file) return;

    setFilename(file as string);

    const spectrum = await invoke<{
      x: number[];
      y: number[];
      peaks: { index: number; intensity: number }[];
    }>("load_spectrum", { path: file });

    setX(spectrum.x);
    setY(spectrum.y);
    setPeaks(spectrum.peaks);
  }

  return (
      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.brand}>ELEMENTUM</div>
          <nav style={styles.nav}>
            <div style={styles.navItemActive}>Spectrum</div>
            <div style={styles.navItem}>History</div>
            <div style={styles.navItem}>Reports</div>
            <div style={styles.navItem}>Settings</div>
          </nav>
        </aside>

        {/* Content */}
        <main style={styles.content}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>Spectrum Analysis</h1>
              <span style={styles.subtitle}>{filename || "No file loaded"}</span>
            </div>
            <button style={styles.button} onClick={handleLoad}>
              + Import CSV
            </button>
          </header>

          <section style={styles.panel}>
            <Plot
                data={[
                  {
                    x,
                    y,
                    type: "scatter",
                    mode: "lines",
                    line: { color: "#4DA3FF", width: 2 },
                  },
                  {
                    x: peaks.map((p) => x[p.index]),
                    y: peaks.map((p) => p.intensity),
                    mode: "markers",
                    marker: { color: "#E55682", size: 9 },
                  },
                ]}
                layout={{
                  paper_bgcolor: "#232528",
                  plot_bgcolor: "#232528",
                  font: { color: "#EDEFF1" },
                  margin: { l: 40, r: 20, t: 20, b: 40 },
                }}
                style={{ width: "100%", height: "350px" }}
            />
          </section>

          <section style={styles.tablePanel}>
            <PeaksTable peaks={peaks} />
          </section>
        </main>
      </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#1B1D1F",
    color: "#EDEFF1",
    fontFamily: "Inter, sans-serif",
  },
  sidebar: {
    width: 220,
    background: "#232528",
    borderRight: "1px solid #32363B",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "1.3px",
    opacity: 0.9,
    marginBottom: 32,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  navItem: {
    padding: "8px 12px",
    borderRadius: 4,
    opacity: 0.7,
    cursor: "pointer",
  },
  navItemActive: {
    padding: "8px 12px",
    borderRadius: 4,
    background: "#2B2E31",
    cursor: "pointer",
    borderLeft: "3px solid #4DA3FF",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 600,
  },
  subtitle: {
    opacity: 0.55,
    fontSize: 12,
  },
  button: {
    padding: "8px 18px",
    background: "#4DA3FF",
    border: "none",
    color: "#1B1D1F",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 600,
  },
  panel: {
    background: "#232528",
    borderRadius: 6,
    border: "1px solid #32363B",
    padding: 12,
    marginBottom: 18,
  },
  tablePanel: {
    background: "#232528",
    borderRadius: 6,
    border: "1px solid #32363B",
    padding: 12,
  },
};
