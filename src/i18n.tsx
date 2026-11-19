import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import type { Category, OrderStatus } from "./domain";

export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];
export const langLabel: Record<Lang, string> = { pt: "Português", en: "English", es: "Español" };
const LOCALE: Record<Lang, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };
const KEY = "vitrine.lang";
const isLang = (v: unknown): v is Lang => typeof v === "string" && (LANGS as readonly string[]).includes(v);

function deviceLang(): Lang {
  try {
    if (Platform.OS === "web") {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (isLang(q)) return q;
    }
    const loc = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    return loc.startsWith("es") ? "es" : loc.startsWith("en") ? "en" : "pt";
  } catch {
    return "pt";
  }
}

const pt = {
  locale: "pt-BR",
  loading: "Carregando seus dados…",
  language: "Idioma",
  tabs: { catalog: "Catálogo", cart: "Carrinho", orders: "Pedidos", shop: "Loja" },
  categories: { Todos: "Todos", Cerâmica: "Cerâmica", Decoração: "Decoração", Presentes: "Presentes" } as Record<Category, string>,
  status: { Recebido: "Recebido", "Em preparo": "Em preparo", "Pronto para retirada": "Pronto para retirada" } as Record<OrderStatus, string>,
  catalog: {
    subtitle: "Pequenas lojas. Boas descobertas.", tagline: "Cerâmica & presentes · loja demonstrativa",
    heroLabel: "Feito para ficar.", heroTitle: "Peças para os seus rituais.", heroBody: "Cerâmica e presentes para dar outro ritmo ao dia.",
    heroAlt: "Vaso de cerâmica com flores", search: "Buscar produtos", searchPh: "O que você está procurando?", categories: "Categorias",
    pick: "Escolha com carinho", pieces: (n: number) => `${n} peças`, none: "Nenhuma peça por aqui", noneText: "Tente outro nome ou escolha outra categoria.",
    see: (n: string) => `Ver ${n}`, add: (n: string) => `Adicionar ${n}`, soldOut: "Esgotado", inCart: (n: number) => `${n} no carrinho`,
    note: "Demonstração de portfólio. Produtos e preços fictícios; nenhum pedido é enviado à loja.",
  },
  product: {
    notFound: "Peça não encontrada", back: "Voltar ao catálogo", catalog: "Catálogo", available: "Disponível", soldOut: "Esgotado",
    pickup: "Retirada na loja fictícia, sem taxa. Este app não processa pagamentos nem envia pedidos reais.",
    add: "Adicionar ao carrinho", units: (n: number) => `${n} unidade(s) no carrinho`, choose: "Escolha sua peça e monte seu pedido.", seeCart: "Ver carrinho",
  },
  cart: {
    title: "Seu carrinho", subtitle: "Escolhido por você, preparado com cuidado.", emptyTitle: "Sua próxima descoberta está aqui",
    emptyText: "Explore o catálogo e adicione suas peças favoritas.", explore: "Explorar catálogo",
    change: (up: boolean, n: string) => `${up ? "Aumentar" : "Diminuir"} quantidade de ${n}`, qty: (n: string, q: number) => `Quantidade de ${n}: ${q}`,
    subtotal: (n: number) => `Subtotal · ${n} itens`, pickup: "Retirada na loja · sem taxa. Pedido demonstrativo: sem pagamento e sem envio à loja.",
    name: "Nome para retirada", namePh: "Use um nome fictício", nameHint: "Obrigatório: de 2 a 80 caracteres.",
    noteLabel: "Observação (opcional)", noteA11y: "Observação", notePh: "Ex.: embrulhar para presente", chars: (n: number) => `${n}/300 caracteres`,
    saving: "Salvando pedido…", create: "Criar pedido demonstrativo", privacy: "Seus dados ficam apenas neste aparelho, sem criptografia. Não use informações pessoais reais.",
  },
  orders: {
    title: "Seus pedidos", subtitle: "Do primeiro toque à próxima retirada.", note: "Acompanhamento simulado. Você controla o status para explorar a experiência da loja.",
    empty: "Ainda sem pedidos", emptyText: "Monte um carrinho para experimentar o fluxo completo.", explore: "Explorar catálogo",
    pickupBy: (n: string) => `Retirada por ${n}`, noteLabel: (n: string) => `Observação: ${n}`, total: "Total demonstrativo",
    prepare: "Simular preparo", ready: "Simular pedido pronto", done: "Tudo pronto! Esta é uma simulação, não uma confirmação real de retirada.",
  },
  shop: {
    subtitle: "Objetos para acompanhar seus dias.", heading: "Uma pequena loja, feita de boas escolhas.",
    intro: "Uma experiência fictícia de cerâmica, decoração e presentes. O Vitrine mostra como um pequeno negócio pode ter um catálogo no celular e organizar pedidos sem complicação.",
    how: "Como experimentar", howText: "Busque uma peça, abra os detalhes, adicione ao carrinho e crie um pedido com um nome fictício. Na aba Pedidos, simule as etapas de preparo.",
    disclaimer: "Projeto de portfólio por VH Code Solutions. Não há loja real, pagamento, entrega, sincronização ou conexão com WhatsApp. Os pedidos são salvos somente neste aparelho.",
    photos: "As fotos são ilustrativas, de fotógrafos do Unsplash; não representam produtos reais à venda. Os créditos estão na documentação do projeto.",
    data: "Seus dados locais", dataText: "Carrinho e pedidos ficam no armazenamento do app, sem criptografia. Limpar a demonstração remove apenas esses dados do Vitrine.",
    clear: "Limpar demonstração", ask: "Excluir o carrinho e todos os pedidos locais? Esta ação não pode ser desfeita.", confirm: "Confirmar limpeza", cancel: "Cancelar",
  },
  errors: {} as Record<string, string>,
};
export type Dict = typeof pt;

const en: Dict = {
  locale: "en-US",
  loading: "Loading your data…",
  language: "Language",
  tabs: { catalog: "Catalog", cart: "Cart", orders: "Orders", shop: "Shop" },
  categories: { Todos: "All", Cerâmica: "Ceramics", Decoração: "Decor", Presentes: "Gifts" },
  status: { Recebido: "Received", "Em preparo": "Being prepared", "Pronto para retirada": "Ready for pickup" },
  catalog: {
    subtitle: "Small shops. Good finds.", tagline: "Ceramics & gifts · demo shop",
    heroLabel: "Made to last.", heroTitle: "Pieces for your rituals.", heroBody: "Ceramics and gifts that give the day a different pace.",
    heroAlt: "Ceramic vase with flowers", search: "Search products", searchPh: "What are you looking for?", categories: "Categories",
    pick: "Choose with care", pieces: (n) => `${n} pieces`, none: "Nothing here", noneText: "Try another name or pick another category.",
    see: (n) => `View ${n}`, add: (n) => `Add ${n}`, soldOut: "Sold out", inCart: (n) => `${n} in cart`,
    note: "Portfolio demo. Products and prices are fictional; no order is sent to the shop.",
  },
  product: {
    notFound: "Piece not found", back: "Back to catalog", catalog: "Catalog", available: "Available", soldOut: "Sold out",
    pickup: "Pickup at the fictional shop, no fee. This app does not process payments or send real orders.",
    add: "Add to cart", units: (n) => `${n} unit(s) in cart`, choose: "Pick your piece and build your order.", seeCart: "View cart",
  },
  cart: {
    title: "Your cart", subtitle: "Chosen by you, prepared with care.", emptyTitle: "Your next find is waiting",
    emptyText: "Browse the catalog and add your favorite pieces.", explore: "Browse catalog",
    change: (up, n) => `${up ? "Increase" : "Decrease"} quantity of ${n}`, qty: (n, q) => `Quantity of ${n}: ${q}`,
    subtotal: (n) => `Subtotal · ${n} items`, pickup: "Pickup at the shop · no fee. Demo order: no payment and nothing sent to the shop.",
    name: "Name for pickup", namePh: "Use a fictional name", nameHint: "Required: 2 to 80 characters.",
    noteLabel: "Note (optional)", noteA11y: "Note", notePh: "E.g. gift wrap it", chars: (n) => `${n}/300 characters`,
    saving: "Saving order…", create: "Create demo order", privacy: "Your data stays on this device only, unencrypted. Do not use real personal information.",
  },
  orders: {
    title: "Your orders", subtitle: "From the first tap to the next pickup.", note: "Simulated tracking. You control the status to explore the shop experience.",
    empty: "No orders yet", emptyText: "Build a cart to try the whole flow.", explore: "Browse catalog",
    pickupBy: (n) => `Pickup by ${n}`, noteLabel: (n) => `Note: ${n}`, total: "Demo total",
    prepare: "Simulate preparing", ready: "Simulate order ready", done: "All set! This is a simulation, not a real pickup confirmation.",
  },
  shop: {
    subtitle: "Objects to keep you company.", heading: "A small shop, made of good choices.",
    intro: "A fictional ceramics, decor and gifts shop. Vitrine shows how a small business can have a catalog on the phone and organize orders without hassle.",
    how: "How to try it", howText: "Search for a piece, open its details, add it to the cart and create an order with a fictional name. In the Orders tab, simulate the preparation steps.",
    disclaimer: "Portfolio project by VH Code Solutions. There is no real shop, payment, delivery, sync or WhatsApp connection. Orders are saved on this device only.",
    photos: "Photos are illustrative, by Unsplash photographers; they are not real products for sale. Credits are in the project documentation.",
    data: "Your local data", dataText: "Cart and orders live in the app storage, unencrypted. Clearing the demo removes only this Vitrine data.",
    clear: "Clear demo", ask: "Delete the cart and every local order? This cannot be undone.", confirm: "Confirm clearing", cancel: "Cancel",
  },
  errors: {
    "Este produto não está disponível.": "This product is not available.",
    "Escolha de 1 a 20 unidades por produto.": "Choose 1 to 20 units per product.",
    "Informe um nome de 2 a 80 caracteres.": "Enter a name with 2 to 80 characters.",
    "A observação pode ter até 300 caracteres.": "The note can have up to 300 characters.",
    "Adicione pelo menos um produto ao carrinho.": "Add at least one product to the cart.",
    "Revise os produtos do seu carrinho.": "Check the products in your cart.",
    "Limite de 100 pedidos demonstrativos. Limpe a demonstração na aba Loja.": "Limit of 100 demo orders. Clear the demo in the Shop tab.",
    "Não foi possível salvar. Tente novamente.": "Could not save. Try again.",
    "Não foi possível carregar os dados locais. Você pode limpar a demonstração na aba Loja.": "Could not load local data. You can clear the demo in the Shop tab.",
  },
};

const es: Dict = {
  locale: "es-ES",
  loading: "Cargando tus datos…",
  language: "Idioma",
  tabs: { catalog: "Catálogo", cart: "Carrito", orders: "Pedidos", shop: "Tienda" },
  categories: { Todos: "Todos", Cerâmica: "Cerámica", Decoração: "Decoración", Presentes: "Regalos" },
  status: { Recebido: "Recibido", "Em preparo": "En preparación", "Pronto para retirada": "Listo para retirar" },
  catalog: {
    subtitle: "Tiendas pequeñas. Buenos hallazgos.", tagline: "Cerámica y regalos · tienda de demostración",
    heroLabel: "Hecho para durar.", heroTitle: "Piezas para tus rituales.", heroBody: "Cerámica y regalos para darle otro ritmo al día.",
    heroAlt: "Jarrón de cerámica con flores", search: "Buscar productos", searchPh: "¿Qué estás buscando?", categories: "Categorías",
    pick: "Elige con cariño", pieces: (n) => `${n} piezas`, none: "No hay piezas aquí", noneText: "Prueba otro nombre o elige otra categoría.",
    see: (n) => `Ver ${n}`, add: (n) => `Añadir ${n}`, soldOut: "Agotado", inCart: (n) => `${n} en el carrito`,
    note: "Demostración de portafolio. Productos y precios ficticios; ningún pedido se envía a la tienda.",
  },
  product: {
    notFound: "Pieza no encontrada", back: "Volver al catálogo", catalog: "Catálogo", available: "Disponible", soldOut: "Agotado",
    pickup: "Retiro en la tienda ficticia, sin costo. Esta app no procesa pagos ni envía pedidos reales.",
    add: "Añadir al carrito", units: (n) => `${n} unidad(es) en el carrito`, choose: "Elige tu pieza y arma tu pedido.", seeCart: "Ver carrito",
  },
  cart: {
    title: "Tu carrito", subtitle: "Elegido por ti, preparado con cuidado.", emptyTitle: "Tu próximo hallazgo está aquí",
    emptyText: "Explora el catálogo y añade tus piezas favoritas.", explore: "Explorar catálogo",
    change: (up, n) => `${up ? "Aumentar" : "Disminuir"} cantidad de ${n}`, qty: (n, q) => `Cantidad de ${n}: ${q}`,
    subtotal: (n) => `Subtotal · ${n} artículos`, pickup: "Retiro en la tienda · sin costo. Pedido de demostración: sin pago y sin envío a la tienda.",
    name: "Nombre para el retiro", namePh: "Usa un nombre ficticio", nameHint: "Obligatorio: de 2 a 80 caracteres.",
    noteLabel: "Nota (opcional)", noteA11y: "Nota", notePh: "Ej.: envolver para regalo", chars: (n) => `${n}/300 caracteres`,
    saving: "Guardando pedido…", create: "Crear pedido de demostración", privacy: "Tus datos quedan solo en este dispositivo, sin cifrado. No uses información personal real.",
  },
  orders: {
    title: "Tus pedidos", subtitle: "Del primer toque al próximo retiro.", note: "Seguimiento simulado. Tú controlas el estado para explorar la experiencia de la tienda.",
    empty: "Aún no hay pedidos", emptyText: "Arma un carrito para probar el flujo completo.", explore: "Explorar catálogo",
    pickupBy: (n) => `Retira ${n}`, noteLabel: (n) => `Nota: ${n}`, total: "Total de demostración",
    prepare: "Simular preparación", ready: "Simular pedido listo", done: "¡Todo listo! Es una simulación, no una confirmación real de retiro.",
  },
  shop: {
    subtitle: "Objetos para acompañar tus días.", heading: "Una tienda pequeña, hecha de buenas elecciones.",
    intro: "Una experiencia ficticia de cerámica, decoración y regalos. Vitrine muestra cómo un negocio pequeño puede tener un catálogo en el celular y organizar pedidos sin complicaciones.",
    how: "Cómo probarlo", howText: "Busca una pieza, abre los detalles, añádela al carrito y crea un pedido con un nombre ficticio. En la pestaña Pedidos, simula las etapas de preparación.",
    disclaimer: "Proyecto de portafolio de VH Code Solutions. No hay tienda real, pago, entrega, sincronización ni conexión con WhatsApp. Los pedidos se guardan solo en este dispositivo.",
    photos: "Las fotos son ilustrativas, de fotógrafos de Unsplash; no representan productos reales a la venta. Los créditos están en la documentación del proyecto.",
    data: "Tus datos locales", dataText: "El carrito y los pedidos quedan en el almacenamiento de la app, sin cifrado. Limpiar la demostración borra solo estos datos de Vitrine.",
    clear: "Limpiar demostración", ask: "¿Borrar el carrito y todos los pedidos locales? Esta acción no se puede deshacer.", confirm: "Confirmar limpieza", cancel: "Cancelar",
  },
  errors: {
    "Este produto não está disponível.": "Este producto no está disponible.",
    "Escolha de 1 a 20 unidades por produto.": "Elige de 1 a 20 unidades por producto.",
    "Informe um nome de 2 a 80 caracteres.": "Indica un nombre de 2 a 80 caracteres.",
    "A observação pode ter até 300 caracteres.": "La nota puede tener hasta 300 caracteres.",
    "Adicione pelo menos um produto ao carrinho.": "Añade al menos un producto al carrito.",
    "Revise os produtos do seu carrinho.": "Revisa los productos de tu carrito.",
    "Limite de 100 pedidos demonstrativos. Limpe a demonstração na aba Loja.": "Límite de 100 pedidos de demostración. Limpia la demostración en la pestaña Tienda.",
    "Não foi possível salvar. Tente novamente.": "No se pudo guardar. Inténtalo de nuevo.",
    "Não foi possível carregar os dados locais. Você pode limpar a demonstração na aba Loja.": "No se pudieron cargar los datos locales. Puedes limpiar la demostración en la pestaña Tienda.",
  },
};

export const dicts: Record<Lang, Dict> = { pt, en, es };

type ProductText = { name: string; description: string };
const PRODUCTS: Record<"en" | "es", Record<string, ProductText>> = {
  en: {
    caneca: { name: "Aurora Mug", description: "A more colorful break. Ceramic mug with a satin finish and 300 ml capacity. Each piece has small variations that make it unique." },
    vaso: { name: "Horizon Vase", description: "Simple lines to hold your flowers. Decorative ceramic vase, 18 cm tall. A piece to make the home feel like yours." },
    bowl: { name: "Everyday Bowl", description: "From breakfast to dinner. 500 ml ceramic bowl with a comfortable shape and handmade finish." },
    jardim: { name: "Little Garden", description: "A gift that grows with you. Planter with a decorative plant and a care card. The species may vary with availability." },
    dupla: { name: "Mug Pair", description: "Two Aurora mugs in gift packaging. An invitation to share a coffee and a good conversation." },
    "vaso-mini": { name: "Mini Vase", description: "A small piece for one flower or a special corner. 10 cm vase. Unavailable in this demo." },
  },
  es: {
    caneca: { name: "Taza Aurora", description: "Una pausa con más color. Taza de cerámica con acabado satinado y capacidad de 300 ml. Cada pieza tiene pequeñas variaciones que la hacen única." },
    vaso: { name: "Jarrón Horizonte", description: "Líneas simples para recibir tus flores. Jarrón decorativo de cerámica de 18 cm de alto. Una pieza para que la casa se parezca a ti." },
    bowl: { name: "Bowl del día", description: "Del desayuno a la cena. Bowl de cerámica de 500 ml, con forma cómoda y acabado artesanal." },
    jardim: { name: "Pequeño jardín", description: "Un regalo que crece contigo. Maceta con planta decorativa y tarjeta de cuidados. La especie puede variar según la disponibilidad." },
    dupla: { name: "Dúo de tazas", description: "Dos tazas Aurora en un empaque de regalo. Una invitación a compartir un café y una buena conversación." },
    "vaso-mini": { name: "Jarrón Mini", description: "Una pieza pequeña para una flor o un rincón especial. Jarrón de 10 cm. No disponible en esta demostración." },
  },
};

type Ctx = {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  productText: (id: string, fallback: ProductText) => ProductText;
  error: (msg: string) => string;
  money: (cents: number) => string;
  date: (iso: string) => string;
};

const Context = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(deviceLang);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => { if (isLang(v) && !(Platform.OS === "web" && new URLSearchParams(window.location.search).get("lang"))) setLangState(v); }).catch(() => {});
  }, []);
  useEffect(() => {
    if (Platform.OS === "web") document.documentElement.lang = LOCALE[lang];
  }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); AsyncStorage.setItem(KEY, l).catch(() => {}); };
  const t = dicts[lang];
  const value: Ctx = {
    lang, t, setLang,
    productText: (id, fallback) => (lang === "pt" ? fallback : PRODUCTS[lang][id] ?? fallback),
    error: (msg) => t.errors[msg] ?? msg,
    money: (cents) => new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "BRL" }).format(cents / 100),
    date: (iso) => new Date(iso).toLocaleDateString(LOCALE[lang]),
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLang() {
  const c = useContext(Context);
  if (!c) throw new Error("LangProvider ausente");
  return c;
}
