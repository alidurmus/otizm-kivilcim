interface _KelimeEsleştirmeOyunuProps {
  onBack: () => void; // Şimdilik kullanılmıyor ama interface compatibility için
}

export default function KelimeEsleştirmeOyunu({ onBack: _onBack }: _KelimeEsleştirmeOyunuProps) {
} 