export default function PeaksTable({ peaks }) {
  return (
      <table style={styles.table}>
        <thead>
        <tr>
          <th>#</th>
          <th>Index</th>
          <th>Intensity</th>
        </tr>
        </thead>
        <tbody>
        {peaks.slice(0, 12).map((p, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{p.index}</td>
              <td>{p.intensity.toFixed(4)}</td>
            </tr>
        ))}
        </tbody>
      </table>
  );
}

const styles: any = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    textAlign: "left",
    paddingBottom: 6,
    borderBottom: "1px solid #32363B",
    opacity: 0.7,
  },
  td: {
    padding: "6px 0",
    borderBottom: "1px solid #32363B",
    opacity: 0.85,
  },
};
