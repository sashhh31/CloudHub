import Image from "next/image"

export function ClientsSection() {
  const clients = [
    { name: "Crowdstrike", logo: "/Crowdstrike.png" },
    { name: "Airbus", logo: "/Airbus.png" },
    { name: "Hays", logo: "/Hays.png" },
    { name: "Sentry", logo: "/Sentry.png" },
    { name: "Medwing", logo: "/Medwing.png" },
    { name: "Cathay Pacific", logo: "/CathayPacific.png" },
    { name: "Liquid Web", logo: "/LiquidWeb.png" },
    { name: "AutoTrader", logo: "/AutoTrader.png" },
  ]

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Loved By Designers At
        </h2>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {clients.map((client, index) => (
            <div key={index} className="flex items-center justify-center rounded-lg bg-gray-50 p-6">
              <Image
                src={client.logo || "/placeholder.svg"}
                alt={client.name}
                width={380}
                height={300}
                className="h-32 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

