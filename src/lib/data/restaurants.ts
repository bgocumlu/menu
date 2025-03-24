export interface MenuItem {
    name: string;
    description: string;
    price: string;
    image: string;
    tags?: string[];
}

export interface MenuCategory {
    title: string;
    description: string;
    items: MenuItem[];
}

export interface MenuData {
    [category: string]: MenuCategory;
}

// Restaurant type definition
export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    menuData: {
        en: MenuData;
        tr: MenuData;
    };
    categories: {
        en: { id: string; name: string }[];
        tr: { id: string; name: string }[];
    };
    categoryMapping: {
        en: { [key: string]: string };
        tr: { [key: string]: string };
    };
    theme: {
        primaryColor: string;
        secondaryColor: string;
    };
    contact: {
        phone: string;
        email: string;
        address: string;
    };
}

const images = {
    humus: "https://cdn.yemek.com/mnresize/1250/833/uploads/2020/09/humus-yemekcom.jpg",
    borek: "https://cdn.yemek.com/mnresize/1250/833/uploads/2022/09/10-dakikada-peynirli-borek-onecikan.jpg",
    dolma: "https://cdn.yemek.com/mncrop/940/625/uploads/2014/07/zeytinyagli-yaprak-sarmasi-yemekcom.jpg",
    cacik: "https://cdn.yemek.com/mncrop/940/625/uploads/2020/08/cacik-diyeti-2.jpg",
    adana: "https://cdn.yemek.com/mncrop/940/625/uploads/2016/05/adana-kebap-one-cikan.jpg",
    iskender:
        "https://cdn.yemek.com/mncrop/940/625/uploads/2017/10/konsept-steak-doner.jpg",
    manti: "https://cdn.yemek.com/mnresize/1250/833/uploads/2017/02/kayseri-mantisi-onecikan-yeni.jpg",
    imam: "https://cdn.yemek.com/mncrop/940/625/uploads/2015/01/imam-bayildi-yeni-one-cikan.jpg",
    baklava:
        "https://cdn.yemek.com/mnresize/1250/833/uploads/2020/01/kolay-baklava-yemekcom.jpg",
    kunefe: "https://cdn.yemek.com/mnresize/1250/833/uploads/2015/05/kunefe-reels-yemekcom-1.jpg",
    lokum: "https://cdn.yemek.com/mnresize/1250/833/uploads/2021/10/lokum-reels-yemekcom.jpg",
    sutlac: "https://cdn.yemek.com/mnresize/1250/833/uploads/2019/05/sutlac-guncelleme-sunum-1.jpg",
    cay: "https://cdn.yemek.com/uploads/2015/01/cay-demleme.jpg",
    kahve: "https://cdn.yemek.com/mnresize/1250/833/uploads/2024/11/vanilyali-turk-kahvesi-tarifi.jpg",
    ayran: "https://cdn.yemek.com/mnresize/1250/833/uploads/2023/10/ayran-sunum-yemekcom.jpg",
    salgam: "https://cdn.yemek.com/mncrop/940/625/uploads/2016/11/salgam-suyu-tarifi.jpg",
};

const prices = {
  humus: "6.50₺",
  borek: "7.50₺",
  dolma: "8.00₺",
  cacik: "5.50₺",
  adana: "18.50₺",
  iskender: "19.00₺",
  manti: "16.50₺",
  imam: "15.00₺",
  baklava: "8.50₺",
  kunefe: "9.00₺",
  lokum: "7.00₺",
  sutlac: "6.50₺",
  cay: "3.00₺",
  kahve: "4.50₺",
  ayran: "3.50₺",
  salgam: "4.00₺",
};

// Anatolia restaurant data
const anatoliaRestaurant: Restaurant = {
    id: "anatolia",
    name: "Anatolia",
    cuisine: "Turkish",
    menuData: {
        en: {
            starters: {
                title: "Starters",
                description:
                    "Begin your culinary journey with our traditional Turkish appetizers",
                items: [
                    {
                        name: "Hummus",
                        description:
                            "Creamy chickpea dip with tahini, olive oil, lemon juice, and garlic. Served with warm pita bread.",
                        price: prices.humus,
                        image: `${images.humus}?height=300&width=400`,
                        tags: ["Vegetarian", "Popular"],
                    },
                    {
                        name: "Börek",
                        description:
                            "Flaky phyllo pastry filled with feta cheese and spinach, baked to golden perfection.",
                        price: prices.borek,
                        image: `${images.borek}?height=300&width=400`,
                        tags: ["Vegetarian"],
                    },
                    {
                        name: "Dolma",
                        description:
                            "Grape leaves delicately stuffed with aromatic rice, pine nuts, currants, and fresh herbs.",
                        price: prices.dolma,
                        image: `${images.dolma}?height=300&width=400`,
                        tags: ["Vegan"],
                    },
                    {
                        name: "Cacık",
                        description:
                            "Refreshing yogurt with cucumber, garlic, mint, and a touch of olive oil. Perfect for dipping.",
                        price: prices.cacik,
                        image: `${images.cacik}?height=300&width=400`,
                        tags: ["Vegetarian", "Cold"],
                    },
                ],
            },
            mains: {
                title: "Main Courses",
                description:
                    "Savor the authentic flavors of Turkish cuisine with our signature dishes",
                items: [
                    {
                        name: "Adana Kebab",
                        description:
                            "Spicy minced lamb kebab seasoned with red pepper and grilled over charcoal. Served with bulgur pilaf and grilled vegetables.",
                        price: prices.adana,
                        image: `${images.adana}?height=300&width=400`,
                        tags: ["Spicy", "Popular"],
                    },
                    {
                        name: "İskender Kebab",
                        description:
                            "Thinly sliced döner kebab layered over pieces of pita bread, topped with tomato sauce, melted butter, and yogurt.",
                        price: prices.iskender,
                        image: `${images.iskender}?height=300&width=400`,
                        tags: ["House Special"],
                    },
                    {
                        name: "Manti",
                        description:
                            "Handmade Turkish dumplings filled with spiced lamb and onions, topped with garlic yogurt, sumac, and mint butter.",
                        price: prices.manti,
                        image: `${images.manti}?height=300&width=400`,
                        tags: ["Traditional"],
                    },
                    {
                        name: "Imam Bayildi",
                        description:
                            "Whole eggplant stuffed with onions, garlic, and tomatoes, slowly cooked in olive oil. Served with rice pilaf.",
                        price: prices.imam,
                        image: `${images.imam}?height=300&width=400`,
                        tags: ["Vegetarian"],
                    },
                ],
            },
            desserts: {
                title: "Desserts",
                description:
                    "Complete your meal with our selection of traditional Turkish sweets",
                items: [
                    {
                        name: "Baklava",
                        description:
                            "Layers of delicate phyllo pastry filled with chopped pistachios, sweetened with honey syrup. Served with vanilla ice cream.",
                        price: prices.baklava,
                        image: `${images.baklava}?height=300&width=400`,
                        tags: ["Popular", "Contains Nuts"],
                    },
                    {
                        name: "Künefe",
                        description:
                            "Shredded phyllo pastry layered with unsalted cheese, soaked in sweet syrup and topped with crushed pistachios.",
                        price: prices.kunefe,
                        image: `${images.kunefe}?height=300&width=400`,
                        tags: ["Hot", "House Special"],
                    },
                    {
                        name: "Turkish Delight",
                        description:
                            "Assorted lokum with various flavors including rose, lemon, and pistachio, dusted with powdered sugar.",
                        price: prices.lokum,
                        image: `${images.lokum}?height=300&width=400`,
                        tags: ["Traditional"],
                    },
                    {
                        name: "Sütlaç",
                        description:
                            "Creamy rice pudding infused with vanilla and cinnamon, baked until golden on top.",
                        price: prices.sutlac,
                        image: `${images.sutlac}?height=300&width=400`,
                        tags: ["Vegetarian"],
                    },
                ],
            },
            drinks: {
                title: "Beverages",
                description:
                    "Complement your meal with traditional Turkish drinks",
                items: [
                    {
                        name: "Turkish Tea",
                        description:
                            "Traditional black tea served in a tulip-shaped glass. The perfect end to any meal.",
                        price: prices.cay,
                        image: `${images.cay}?height=300&width=400`,
                        tags: ["Hot", "Traditional"],
                    },
                    {
                        name: "Turkish Coffee",
                        description:
                            "Finely ground coffee brewed in a cezve, served with Turkish delight on the side.",
                        price: prices.kahve,
                        image: `${images.kahve}?height=300&width=400`,
                        tags: ["Hot", "Traditional"],
                    },
                    {
                        name: "Ayran",
                        description:
                            "Refreshing yogurt drink with a touch of salt. A perfect companion to spicy dishes.",
                        price: prices.ayran,
                        image: `${images.ayran}?height=300&width=400`,
                        tags: ["Cold", "Popular"],
                    },
                    {
                        name: "Şalgam",
                        description:
                            "Fermented turnip and carrot juice with a tangy flavor. An acquired taste loved by many.",
                        price: prices.salgam,
                        image: `${images.salgam}?height=300&width=400`,
                        tags: ["Cold", "Tangy"],
                    },
                ],
            },
        },
        tr: {
            starters: {
                title: "Başlangıçlar",
                description:
                    "Geleneksel Türk mutfağının lezzetli başlangıçlarıyla yemeğinize başlayın",
                items: [
                    {
                        name: "Humus",
                        description:
                            "Tahin, zeytinyağı, limon suyu ve sarımsak ile hazırlanan kremalı nohut ezmesi. Sıcak pide ile servis edilir.",
                        price: prices.humus,
                        image: `${images.humus}?height=300&width=400`,
                        tags: ["Vejetaryen", "Popüler"],
                    },
                    {
                        name: "Börek",
                        description:
                            "Beyaz peynir ve ıspanak ile doldurulmuş, altın renginde kızarana kadar pişirilmiş katlı yufka.",
                        price: prices.borek,
                        image: `${images.borek}?height=300&width=400`,
                        tags: ["Vejetaryen"],
                    },
                    {
                        name: "Yaprak Sarma",
                        description:
                            "Aromatik pirinç, çam fıstığı, kuş üzümü ve taze otlar ile doldurulmuş asma yaprağı.",
                        price: prices.dolma,
                        image: `${images.dolma}?height=300&width=400`,
                        tags: ["Vegan"],
                    },
                    {
                        name: "Cacık",
                        description:
                            "Salatalık, sarımsak, nane ve zeytinyağı ile hazırlanan ferahlatıcı yoğurt. Mükemmel bir meze.",
                        price: prices.cacik,
                        image: `${images.cacik}?height=300&width=400`,
                        tags: ["Vejetaryen", "Soğuk"],
                    },
                ],
            },
            mains: {
                title: "Ana Yemekler",
                description:
                    "Türk mutfağının otantik lezzetlerini imza yemeklerimizle keşfedin",
                items: [
                    {
                        name: "Adana Kebap",
                        description:
                            "Kırmızı biber ile tatlandırılmış, kömür ateşinde pişirilmiş acılı kıyma kebabı. Bulgur pilavı ve ızgara sebzeler ile servis edilir.",
                        price: prices.adana,
                        image: `${images.adana}?height=300&width=400`,
                        tags: ["Acılı", "Popüler"],
                    },
                    {
                        name: "İskender Kebap",
                        description:
                            "İnce dilimlenmiş döner kebabı, pide parçaları üzerinde, domates sosu, eritilmiş tereyağı ve yoğurt ile servis edilir.",
                        price: prices.iskender,
                        image: `${images.iskender}?height=300&width=400`,
                        tags: ["Şef Spesiyali"],
                    },
                    {
                        name: "Mantı",
                        description:
                            "Baharatlı kuzu kıyması ve soğan ile doldurulmuş el yapımı Türk mantısı, sarımsaklı yoğurt, sumak ve naneli tereyağı ile servis edilir.",
                        price: prices.manti,
                        image: `${images.manti}?height=300&width=400`,
                        tags: ["Geleneksel"],
                    },
                    {
                        name: "İmam Bayıldı",
                        description:
                            "Soğan, sarımsak ve domates ile doldurulmuş, zeytinyağında yavaşça pişirilmiş bütün patlıcan. Pirinç pilavı ile servis edilir.",
                        price: prices.imam,
                        image: `${images.imam}?height=300&width=400`,
                        tags: ["Vejetaryen"],
                    },
                ],
            },
            desserts: {
                title: "Tatlılar",
                description:
                    "Yemeğinizi geleneksel Türk tatlılarımızla tamamlayın",
                items: [
                    {
                        name: "Baklava",
                        description:
                            "Kıyılmış Antep fıstığı ile doldurulmuş, bal şerbeti ile tatlandırılmış ince yufka katmanları. Vanilyalı dondurma ile servis edilir.",
                        price: prices.baklava,
                        image: `${images.baklava}?height=300&width=400`,
                        tags: ["Popüler", "Fıstık İçerir"],
                    },
                    {
                        name: "Künefe",
                        description:
                            "Tuzsuz peynir ile katmanlanmış kadayıf, tatlı şerbet ile ıslatılmış ve Antep fıstığı ile süslenmiş.",
                        price: prices.kunefe,
                        image: `${images.kunefe}?height=300&width=400`,
                        tags: ["Sıcak", "Şef Spesiyali"],
                    },
                    {
                        name: "Türk Lokumu",
                        description:
                            "Gül, limon ve Antep fıstığı dahil çeşitli aromalarda lokum, pudra şekeri ile kaplanmış.",
                        price: prices.lokum,
                        image: `${images.lokum}?height=300&width=400`,
                        tags: ["Geleneksel"],
                    },
                    {
                        name: "Sütlaç",
                        description:
                            "Vanilya ve tarçın ile tatlandırılmış, üzeri altın renginde kızarana kadar pişirilmiş kremalı pirinç muhallebisi.",
                        price: prices.sutlac,
                        image: `${images.sutlac}?height=300&width=400`,
                        tags: ["Vejetaryen"],
                    },
                ],
            },
            drinks: {
                title: "İçecekler",
                description:
                    "Yemeğinizi geleneksel Türk içecekleri ile tamamlayın",
                items: [
                    {
                        name: "Türk Çayı",
                        description:
                            "Lale şeklindeki bardakta servis edilen geleneksel siyah çay. Her yemeğin mükemmel sonu.",
                        price: prices.cay,
                        image: `${images.cay}?height=300&width=400`,
                        tags: ["Sıcak", "Geleneksel"],
                    },
                    {
                        name: "Türk Kahvesi",
                        description:
                            "Cezve'de pişirilmiş ince öğütülmüş kahve, yanında Türk lokumu ile servis edilir.",
                        price: prices.kahve,
                        image: `${images.kahve}?height=300&width=400`,
                        tags: ["Sıcak", "Geleneksel"],
                    },
                    {
                        name: "Ayran",
                        description:
                            "Bir tutam tuz ile hazırlanan ferahlatıcı yoğurt içeceği. Acılı yemeklerin mükemmel eşlikçisi.",
                        price: prices.ayran,
                        image: `${images.ayran}?height=300&width=400`,
                        tags: ["Soğuk", "Popüler"],
                    },
                    {
                        name: "Şalgam",
                        description:
                            "Ekşi lezzetiyle şalgam ve havuç suyu. Birçok kişinin sevdiği özel bir lezzet.",
                        price: prices.salgam,
                        image: `${images.salgam}?height=300&width=400`,
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
};

// Store all restaurants
const restaurants: Record<string, Restaurant> = {
    anatolia: anatoliaRestaurant,
};

// Function to get restaurant data by ID
export function getRestaurantData(id: string): Restaurant | null {
    return restaurants[id] || null;
}
