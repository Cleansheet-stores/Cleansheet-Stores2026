import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Barcelona Home 2024/25",
      slug: "barcelona-home-2024-25",
      description:
        "Official-style Barcelona home jersey for the 2024/25 season.\n\n• Premium polyester fabric\n• Breathable mesh panels\n• Club crest and sponsor print\n• Fan version fit",
      price: 899,
      category: "Club",
      featured: true,
      images: JSON.stringify(["/logo.png"]),
    },
    {
      name: "Real Madrid Away 2024/25",
      slug: "real-madrid-away-2024-25",
      description:
        "Real Madrid away kit in classic white and gold trim.\n\n• Lightweight performance material\n• Embroidered club badge\n• Available in all sizes\n• Perfect for match days",
      price: 899,
      category: "Club",
      featured: true,
      images: JSON.stringify(["/logo.png"]),
    },
    {
      name: "India National Team Home",
      slug: "india-national-home",
      description:
        "Support Team India with this national team home jersey.\n\n• Official blue colorway\n• AIFF-inspired design\n• Comfortable regular fit\n• Show your pride",
      price: 799,
      category: "National Team",
      featured: true,
      images: JSON.stringify(["/logo.png"]),
    },
    {
      name: "Retro Brazil 2002",
      slug: "retro-brazil-2002",
      description:
        "Classic Brazil 2002 World Cup inspired retro jersey.\n\n• Iconic yellow and green\n• Nostalgic collar design\n• Soft cotton blend feel\n• Collector favorite",
      price: 749,
      category: "Retro",
      featured: false,
      images: JSON.stringify(["/logo.png"]),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        sizes: {
          create: [
            { size: "S", stock: 10 },
            { size: "M", stock: 15 },
            { size: "L", stock: 15 },
            { size: "XL", stock: 10 },
            { size: "XXL", stock: 5 },
          ],
        },
      },
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
