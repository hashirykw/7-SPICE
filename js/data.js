const SITE = {
  phone: '0331 6237717',
  whatsapp: '923316237717',
  deliveryFee: 150,
  taxRate: 0.05,
};

const photo = (id, w = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

const MENU = {
  'BBQ & Grill': [
    { n: 'Chicken Malai Boti', d: 'Creamy, tender chunks off the live grill', p: 1195, img: photo('1599487488170-d11ec9c172f0'), tag: 'Bestseller' },
    { n: 'Beef Seekh Kebab', d: 'Spiced minced beef, char-grilled', p: 1095, img: photo('1544025162-d76694265947') },
    { n: 'Chicken Tikka', d: 'Bone-in tikka, smoky and juicy', p: 995, img: photo('1610057099443-fde8c4d50f91') },
    { n: 'BBQ Platter for 2', d: 'Malai boti, seekh, tikka, naan and chutney', p: 2495, img: photo('1555939594-58d7cb561ad1'), tag: 'For two' },
  ],
  'Desi Mains': [
    { n: 'Chicken Karahi', d: 'Wok karahi, half or full', p: 1650, img: photo('1631452180519-c014fe946bc7'), tag: 'House special' },
    { n: 'Mutton Handi', d: 'Slow-cooked mutton in a thick gravy', p: 1995, img: photo('1585937421612-70a008356fbe') },
    { n: 'Dal Makhani', d: 'Black lentils with butter, cooked slow', p: 745, img: photo('1546833999-b9f581a1996d') },
    { n: 'Chicken Biryani', d: 'Layered rice with spiced chicken', p: 895, img: photo('1563379091339-03b21ab4a4f8') },
  ],
  'Chinese': [
    { n: 'Chicken Manchurian', d: 'Crispy chicken in tangy Manchurian sauce', p: 1545, img: photo('1603133872878-684f208fb84b') },
    { n: 'Chicken Chowmein', d: 'Wok-tossed noodles with vegetables', p: 1245, img: photo('1585032226651-759b368d7246') },
    { n: 'Chef Special Rice', d: 'Egg-fried rice with chicken', p: 1345, img: photo('1512058564366-18510be2db19') },
    { n: 'Chilli Dry Beef', d: 'Crispy beef in a chilli glaze', p: 1795, img: photo('1626804475297-41608ea09aeb'), tag: 'Spicy' },
  ],
  'Appetizers': [
    { n: 'Dynamite Prawns', d: 'Crispy prawns in spicy mayo', p: 1695, img: photo('1625938145312-c98745d2f8e8') },
    { n: 'Crumbed Finger Fish', d: 'Fried fish fingers, 5 pcs', p: 1495, img: photo('1580217593608-61931cefc821') },
    { n: 'Honey Mustard Strips', d: 'Chicken strips, honey-mustard glaze', p: 645, img: photo('1562967914-608f82629710') },
    { n: 'Skillet Cheese Fries', d: 'Fries under melted cheese', p: 745, img: photo('1573080496219-bb080dd4f877') },
  ],
  'Soups & Salad': [
    { n: 'Hot & Sour Soup', d: 'Tangy, peppery chicken broth', p: 445, img: photo('1547592166-23ac45744acd') },
    { n: 'Cream of Mushroom', d: 'Thick mushroom soup', p: 445, img: photo('1547592180-85f173990554') },
    { n: 'Thai Beef Salad', d: 'Greens, sliced beef, lime dressing', p: 645, img: photo('1540189549336-e6e99c3679fe') },
    { n: 'Caesar Salad', d: 'Romaine, parmesan and croutons', p: 775, img: photo('1550304943-4f24f54ddde9') },
  ],
  'Desserts': [
    { n: 'Drip Cake Slice', d: 'A slice of our celebration cake', p: 595, img: photo('1578985545062-69928b1d9587') },
    { n: 'Molten Lava Cake', d: 'Warm chocolate cake, soft centre', p: 545, img: photo('1624353365286-3f8d62daad51') },
    { n: 'Fruit Trifle', d: 'Custard, sponge, cream and fruit', p: 395, img: photo('1488477181946-6428a0291777') },
  ],
};

Object.values(MENU).flat().forEach(d => {
  d.id = d.n.toLowerCase().replace(/[^a-z0-9]+/g, '-');
});
