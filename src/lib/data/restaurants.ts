export interface MenuItem {
  name: string
  description: string
  price: string
  image: string
  tags?: string[]
}

export interface MenuCategory {
  title: string
  description: string
  items: MenuItem[]
}

export interface MenuData {
  [category: string]: MenuCategory
}

// Restaurant type definition
export interface Restaurant {
  id: string
  name: string
  cuisine: string
  menuData: {
    en: MenuData
    tr: MenuData
  }
  categories: {
    en: { id: string; name: string }[]
    tr: { id: string; name: string }[]
  }
  categoryMapping: {
    en: { [key: string]: string }
    tr: { [key: string]: string }
  }
  theme: {
    primaryColor: string
    secondaryColor: string
  }
  contact: {
    phone: string
    email: string
    address: string
  }
}

// Anatolia restaurant data
const anatoliaRestaurant: Restaurant = {
  id: "anatolia",
  name: "Anatolia",
  cuisine: "Turkish",
  menuData: {
    en: {
      starters: {
        title: "Starters",
        description: "Begin your culinary journey with our traditional Turkish appetizers",
        items: [
          {
            name: "Hummus",
            description:
              "Creamy chickpea dip with tahini, olive oil, lemon juice, and garlic. Served with warm pita bread.",
            price: "6.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegetarian", "Popular"],
          },
          {
            name: "Börek",
            description: "Flaky phyllo pastry filled with feta cheese and spinach, baked to golden perfection.",
            price: "7.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegetarian"],
          },
          {
            name: "Dolma",
            description: "Grape leaves delicately stuffed with aromatic rice, pine nuts, currants, and fresh herbs.",
            price: "8.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegan"],
          },
          {
            name: "Cacık",
            description:
              "Refreshing yogurt with cucumber, garlic, mint, and a touch of olive oil. Perfect for dipping.",
            price: "5.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegetarian", "Cold"],
          },
        ],
      },
      mains: {
        title: "Main Courses",
        description: "Savor the authentic flavors of Turkish cuisine with our signature dishes",
        items: [
          {
            name: "Adana Kebab",
            description:
              "Spicy minced lamb kebab seasoned with red pepper and grilled over charcoal. Served with bulgur pilaf and grilled vegetables.",
            price: "18.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Spicy", "Popular"],
          },
          {
            name: "İskender Kebab",
            description:
              "Thinly sliced döner kebab layered over pieces of pita bread, topped with tomato sauce, melted butter, and yogurt.",
            price: "19.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["House Special"],
          },
          {
            name: "Manti",
            description:
              "Handmade Turkish dumplings filled with spiced lamb and onions, topped with garlic yogurt, sumac, and mint butter.",
            price: "16.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Traditional"],
          },
          {
            name: "Imam Bayildi",
            description:
              "Whole eggplant stuffed with onions, garlic, and tomatoes, slowly cooked in olive oil. Served with rice pilaf.",
            price: "15.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegetarian"],
          },
        ],
      },
      desserts: {
        title: "Desserts",
        description: "Complete your meal with our selection of traditional Turkish sweets",
        items: [
          {
            name: "Baklava",
            description:
              "Layers of delicate phyllo pastry filled with chopped pistachios, sweetened with honey syrup. Served with vanilla ice cream.",
            price: "8.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Popular", "Contains Nuts"],
          },
          {
            name: "Künefe",
            description:
              "Shredded phyllo pastry layered with unsalted cheese, soaked in sweet syrup and topped with crushed pistachios.",
            price: "9.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Hot", "House Special"],
          },
          {
            name: "Turkish Delight",
            description:
              "Assorted lokum with various flavors including rose, lemon, and pistachio, dusted with powdered sugar.",
            price: "7.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Traditional"],
          },
          {
            name: "Sütlaç",
            description: "Creamy rice pudding infused with vanilla and cinnamon, baked until golden on top.",
            price: "6.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegetarian"],
          },
        ],
      },
      drinks: {
        title: "Beverages",
        description: "Complement your meal with traditional Turkish drinks",
        items: [
          {
            name: "Turkish Tea",
            description: "Traditional black tea served in a tulip-shaped glass. The perfect end to any meal.",
            price: "3.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Hot", "Traditional"],
          },
          {
            name: "Turkish Coffee",
            description: "Finely ground coffee brewed in a cezve, served with Turkish delight on the side.",
            price: "4.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Hot", "Traditional"],
          },
          {
            name: "Ayran",
            description: "Refreshing yogurt drink with a touch of salt. A perfect companion to spicy dishes.",
            price: "3.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Cold", "Popular"],
          },
          {
            name: "Şalgam",
            description: "Fermented turnip and carrot juice with a tangy flavor. An acquired taste loved by many.",
            price: "4.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Cold", "Tangy"],
          },
        ],
      },
    },
    tr: {
      starters: {
        title: "Başlangıçlar",
        description: "Geleneksel Türk mutfağının lezzetli başlangıçlarıyla yemeğinize başlayın",
        items: [
          {
            name: "Humus",
            description:
              "Tahin, zeytinyağı, limon suyu ve sarımsak ile hazırlanan kremalı nohut ezmesi. Sıcak pide ile servis edilir.",
            price: "6.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vejetaryen", "Popüler"],
          },
          {
            name: "Börek",
            description:
              "Beyaz peynir ve ıspanak ile doldurulmuş, altın renginde kızarana kadar pişirilmiş katlı yufka.",
            price: "7.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vejetaryen"],
          },
          {
            name: "Yaprak Sarma",
            description: "Aromatik pirinç, çam fıstığı, kuş üzümü ve taze otlar ile doldurulmuş asma yaprağı.",
            price: "8.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vegan"],
          },
          {
            name: "Cacık",
            description:
              "Salatalık, sarımsak, nane ve zeytinyağı ile hazırlanan ferahlatıcı yoğurt. Mükemmel bir meze.",
            price: "5.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vejetaryen", "Soğuk"],
          },
        ],
      },
      mains: {
        title: "Ana Yemekler",
        description: "Türk mutfağının otantik lezzetlerini imza yemeklerimizle keşfedin",
        items: [
          {
            name: "Adana Kebap",
            description:
              "Kırmızı biber ile tatlandırılmış, kömür ateşinde pişirilmiş acılı kıyma kebabı. Bulgur pilavı ve ızgara sebzeler ile servis edilir.",
            price: "18.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Acılı", "Popüler"],
          },
          {
            name: "İskender Kebap",
            description:
              "İnce dilimlenmiş döner kebabı, pide parçaları üzerinde, domates sosu, eritilmiş tereyağı ve yoğurt ile servis edilir.",
            price: "19.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Şef Spesiyali"],
          },
          {
            name: "Mantı",
            description:
              "Baharatlı kuzu kıyması ve soğan ile doldurulmuş el yapımı Türk mantısı, sarımsaklı yoğurt, sumak ve naneli tereyağı ile servis edilir.",
            price: "16.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Geleneksel"],
          },
          {
            name: "İmam Bayıldı",
            description:
              "Soğan, sarımsak ve domates ile doldurulmuş, zeytinyağında yavaşça pişirilmiş bütün patlıcan. Pirinç pilavı ile servis edilir.",
            price: "15.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vejetaryen"],
          },
        ],
      },
      desserts: {
        title: "Tatlılar",
        description: "Yemeğinizi geleneksel Türk tatlılarımızla tamamlayın",
        items: [
          {
            name: "Baklava",
            description:
              "Kıyılmış Antep fıstığı ile doldurulmuş, bal şerbeti ile tatlandırılmış ince yufka katmanları. Vanilyalı dondurma ile servis edilir.",
            price: "8.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Popüler", "Fıstık İçerir"],
          },
          {
            name: "Künefe",
            description:
              "Tuzsuz peynir ile katmanlanmış kadayıf, tatlı şerbet ile ıslatılmış ve Antep fıstığı ile süslenmiş.",
            price: "9.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Sıcak", "Şef Spesiyali"],
          },
          {
            name: "Türk Lokumu",
            description: "Gül, limon ve Antep fıstığı dahil çeşitli aromalarda lokum, pudra şekeri ile kaplanmış.",
            price: "7.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Geleneksel"],
          },
          {
            name: "Sütlaç",
            description:
              "Vanilya ve tarçın ile tatlandırılmış, üzeri altın renginde kızarana kadar pişirilmiş kremalı pirinç muhallebisi.",
            price: "6.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Vejetaryen"],
          },
        ],
      },
      drinks: {
        title: "İçecekler",
        description: "Yemeğinizi geleneksel Türk içecekleri ile tamamlayın",
        items: [
          {
            name: "Türk Çayı",
            description: "Lale şeklindeki bardakta servis edilen geleneksel siyah çay. Her yemeğin mükemmel sonu.",
            price: "3.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Sıcak", "Geleneksel"],
          },
          {
            name: "Türk Kahvesi",
            description: "Cezve'de pişirilmiş ince öğütülmüş kahve, yanında Türk lokumu ile servis edilir.",
            price: "4.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Sıcak", "Geleneksel"],
          },
          {
            name: "Ayran",
            description:
              "Bir tutam tuz ile hazırlanan ferahlatıcı yoğurt içeceği. Acılı yemeklerin mükemmel eşlikçisi.",
            price: "3.50",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Soğuk", "Popüler"],
          },
          {
            name: "Şalgam",
            description: "Ekşi lezzetiyle şalgam ve havuç suyu. Birçok kişinin sevdiği özel bir lezzet.",
            price: "4.00",
            image: "/placeholder.svg?height=300&width=400",
            tags: ["Soğuk", "Ekşi"],
          },
        ],
      },
    },
  },
  categories: {
    en: [
      { id: "starters", name: "Starters" },
      { id: "mains", name: "Main Courses" },
      { id: "desserts", name: "Desserts" },
      { id: "drinks", name: "Drinks" },
    ],
    tr: [
      { id: "starters", name: "Başlangıçlar" },
      { id: "mains", name: "Ana Yemekler" },
      { id: "desserts", name: "Tatlılar" },
      { id: "drinks", name: "İçecekler" },
    ],
  },
  categoryMapping: {
    en: {
      starters: "starters",
      mains: "mains",
      desserts: "desserts",
      drinks: "drinks",
    },
    tr: {
      starters: "starters",
      mains: "mains",
      desserts: "desserts",
      drinks: "drinks",
    },
  },
  theme: {
    primaryColor: "#c83232",
    secondaryColor: "#00798c",
  },
  contact: {
    phone: "(123) 456-7890",
    email: "info@anatoliarestaurant.com",
    address: "123 Turkish Avenue, City",
  },
}

// Store all restaurants
const restaurants: Record<string, Restaurant> = {
  anatolia: anatoliaRestaurant,
}

// Function to get restaurant data by ID
export function getRestaurantData(id: string): Restaurant | null {
  return restaurants[id] || null
}

