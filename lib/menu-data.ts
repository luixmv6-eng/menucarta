export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  tags: string[]
  isSignature?: boolean
  pairingNote?: string
}

export interface MenuCategory {
  id: string
  name: string
  description: string
  icon: string
  items: MenuItem[]
}

export const menuCategories: MenuCategory[] = [
  {
    id: "appetizers",
    name: "Appetizers",
    description: "Delicate beginnings to awaken your palate",
    icon: "utensils",
    items: [
      {
        id: "app-1",
        name: "Seared Hokkaido Scallops",
        description: "Hand-dived scallops with cauliflower three ways, golden raisin purée, and burnt butter foam",
        price: 38,
        image: "/images/scallops.jpg",
        tags: ["Seafood", "Gluten-Free"],
        isSignature: true,
        pairingNote: "Pairs beautifully with Chablis Premier Cru"
      },
      {
        id: "app-2",
        name: "Foie Gras Torchon",
        description: "Silken duck liver with Sauternes gelée, toasted brioche, and Périgord truffle shavings",
        price: 42,
        image: "/images/foie-gras.jpg",
        tags: ["Rich", "Classic"],
        pairingNote: "Sauternes or late-harvest Riesling"
      },
      {
        id: "app-3",
        name: "Burrata Caprese",
        description: "Creamy Pugliese burrata with heirloom tomatoes, aged balsamic, and micro basil",
        price: 28,
        image: "/images/burrata.jpg",
        tags: ["Vegetarian", "Light"]
      },
      {
        id: "app-4",
        name: "Tuna Tartare",
        description: "Sashimi-grade bluefin with avocado mousse, ponzu pearls, and wasabi tobiko",
        price: 36,
        image: "/images/tuna-tartare.jpg",
        tags: ["Raw", "Seafood"],
        isSignature: true
      }
    ]
  },
  {
    id: "mains",
    name: "Mains",
    description: "Masterfully crafted centerpieces",
    icon: "chef-hat",
    items: [
      {
        id: "main-1",
        name: "Wagyu A5 Ribeye",
        description: "Japanese Miyazaki wagyu with bone marrow crust, truffle jus, and charred shallots",
        price: 185,
        image: "/images/wagyu.jpg",
        tags: ["Signature", "Red Meat"],
        isSignature: true,
        pairingNote: "Barolo Riserva or aged Burgundy"
      },
      {
        id: "main-2",
        name: "Butter-Poached Lobster",
        description: "Maine lobster tail with champagne beurre blanc, seasonal vegetables, and caviar",
        price: 98,
        image: "/images/lobster.jpg",
        tags: ["Seafood", "Luxurious"]
      },
      {
        id: "main-3",
        name: "Duck Breast à l'Orange",
        description: "Rohan duck with blood orange reduction, confit leg croquette, and baby turnips",
        price: 68,
        image: "/images/duck.jpg",
        tags: ["Poultry", "Classic"]
      },
      {
        id: "main-4",
        name: "Wild Mushroom Risotto",
        description: "Carnaroli rice with porcini, chanterelles, white truffle oil, and aged Parmigiano",
        price: 52,
        image: "/images/risotto.jpg",
        tags: ["Vegetarian", "Comfort"],
        pairingNote: "White Burgundy or light Pinot Noir"
      },
      {
        id: "main-5",
        name: "Chilean Sea Bass",
        description: "Miso-glazed seabass with bok choy, ginger emulsion, and crispy shallots",
        price: 78,
        image: "/images/seabass.jpg",
        tags: ["Seafood", "Asian-Inspired"]
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Indulgent endings to complete your journey",
    icon: "cake",
    items: [
      {
        id: "des-1",
        name: "Chocolate Sphere",
        description: "Valrhona dark chocolate dome with salted caramel core, revealed by warm ganache",
        price: 24,
        image: "/images/chocolate-sphere.jpg",
        tags: ["Chocolate", "Interactive"],
        isSignature: true
      },
      {
        id: "des-2",
        name: "Crème Brûlée",
        description: "Tahitian vanilla bean custard with caramelized sugar crust and fresh berries",
        price: 18,
        image: "/images/creme-brulee.jpg",
        tags: ["Classic", "Gluten-Free"]
      },
      {
        id: "des-3",
        name: "Soufflé Grand Marnier",
        description: "Light orange soufflé with vanilla crème anglaise, prepared to order",
        price: 22,
        image: "/images/souffle.jpg",
        tags: ["French", "Light"],
        pairingNote: "Pairs with Muscat de Beaumes-de-Venise"
      },
      {
        id: "des-4",
        name: "Artisanal Cheese Selection",
        description: "Five seasonal cheeses with honeycomb, fig compote, and walnut bread",
        price: 32,
        image: "/images/cheese.jpg",
        tags: ["Savory", "Shareable"]
      }
    ]
  },
  {
    id: "cocktails",
    name: "Cocktails",
    description: "Crafted libations from our master mixologists",
    icon: "wine",
    items: [
      {
        id: "cock-1",
        name: "Lumina Negroni",
        description: "House-infused gin with Campari, Carpano Antica, and 24k gold flakes",
        price: 22,
        image: "/images/negroni.jpg",
        tags: ["Bitter", "Strong"],
        isSignature: true
      },
      {
        id: "cock-2",
        name: "Caviar Martini",
        description: "Beluga vodka, dry vermouth mist, with Osetra caviar pearls",
        price: 38,
        image: "/images/martini.jpg",
        tags: ["Luxurious", "Cold"],
        isSignature: true
      },
      {
        id: "cock-3",
        name: "Hibiki Highball",
        description: "Japanese Hibiki harmony whiskey with artisanal soda and hand-carved ice",
        price: 28,
        image: "/images/whiskey.jpg",
        tags: ["Refreshing", "Japanese"]
      },
      {
        id: "cock-4",
        name: "Golden Champagne Cocktail",
        description: "Vintage Dom Pérignon with Cognac, angostura, and edible gold leaf",
        price: 45,
        image: "/images/champagne.jpg",
        tags: ["Celebration", "Elegant"]
      }
    ]
  }
]
