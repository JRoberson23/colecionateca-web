import Hero from "../components/Hero";
import ProdutosDestaque from "../components/ProdutosDestaque";
import Sobre from "../components/Sobre";

export default function Home() {
  return (
    <div>
      <Hero />
      <ProdutosDestaque />
      <Sobre />
    </div>
  );
}