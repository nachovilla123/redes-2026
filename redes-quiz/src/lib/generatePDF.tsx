import type { Flashcard } from "@/data/index";

export async function downloadReviewPDF(
  cards: Flashcard[],
  topicTitle: string,
  filename: string
) {
  const { pdf, Document, Page, Text, View, StyleSheet } = await import(
    "@react-pdf/renderer"
  );

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#ffffff",
      paddingHorizontal: 36,
      paddingVertical: 32,
      fontFamily: "Helvetica",
    },
    header: {
      marginBottom: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
      borderBottomStyle: "solid",
    },
    headerTitle: {
      fontSize: 15,
      fontFamily: "Helvetica-Bold",
      color: "#0f172a",
    },
    headerMeta: {
      fontSize: 9,
      color: "#94a3b8",
      marginTop: 4,
    },
    card: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderStyle: "solid",
      borderRadius: 6,
    },
    cardFront: {
      backgroundColor: "#f8fafc",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
      borderBottomStyle: "solid",
    },
    tag: {
      fontSize: 7,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 3,
    },
    question: {
      fontSize: 10,
      fontFamily: "Helvetica-Bold",
      color: "#1e293b",
      lineHeight: 1.4,
    },
    cardBack: {
      backgroundColor: "#ffffff",
      padding: 10,
    },
    answer: {
      fontSize: 9,
      color: "#475569",
      lineHeight: 1.55,
    },
    pageNumber: {
      position: "absolute",
      fontSize: 8,
      bottom: 20,
      right: 36,
      color: "#94a3b8",
    },
  });

  const date = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const PDFDoc = () => (
    <Document title={`Repaso - ${topicTitle}`} author="Redes Quiz">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tarjetas para repasar: {topicTitle}</Text>
          <Text style={styles.headerMeta}>
            {cards.length} {cards.length === 1 ? "tarjeta" : "tarjetas"} · {date}
          </Text>
        </View>

        {cards.map((card, i) => (
          <View key={i} style={styles.card} wrap={false}>
            <View style={styles.cardFront}>
              <Text style={styles.tag}>{card.tag}</Text>
              <Text style={styles.question}>{card.front}</Text>
            </View>
            <View style={styles.cardBack}>
              <Text style={styles.answer}>{card.back}</Text>
            </View>
          </View>
        ))}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );

  const blob = await pdf(<PDFDoc />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
