// seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Cria uma barbearia chamada "PedroCorte"
  const barbershop = await prisma.barbershop.findFirst({
    where: {
      name: 'HairSalon',
    },
  });

  if(!barbershop) {
    return
  }

  // Cria profissionais para a barbearia
  const professionals = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.professional.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          cpf: faker.string.uuid(),
          barbershopId: barbershop.id,
        },
      })
    )
  );

  // Cria serviços oferecidos pela barbearia
  const services = await Promise.all(
    ['Corte de Cabelo', 'Barba', 'Corte e Barba'].map((serviceName) =>
      prisma.service.create({
        data: {
          name: serviceName,
          priceInCents: faker.number.int({ min: 3000, max: 6000 }),
          description: faker.lorem.sentence(),
          durationInMinutes: faker.number.int({ min: 30, max: 60 }),
          barbershopId: barbershop.id,
        },
      })
    )
  );

  // Cria clientes para a barbearia
  const clients = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.client.create({
        data: {
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          barbershopId: barbershop.id,
        },
      })
    )
  );

  // Cria agendamentos para a barbearia
  const bookings = await Promise.all(
    Array.from({ length: 800 }).map(() => {
      const startDate = faker.date.between({
        from: '2024-01-01',
        to: '2024-12-31'
      });
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + faker.number.int({ min: 30, max: 120 }));

      return prisma.booking.create({
        data: {
          startDate,
          endDate,
          createdAt: faker.date.past(),
          barbershopId: barbershop.id,
          clientId: faker.helpers.arrayElement(clients).id,
          serviceId: faker.helpers.arrayElement(services).id,
          professionalId: faker.helpers.arrayElement(professionals).id,
          observations: faker.lorem.sentence(),
          status: 'COMPLETED',
        },
      });
    })
  );

  // Cria pagamentos relacionados aos agendamentos
  await Promise.all(
    bookings.map((booking) =>
      prisma.payment.create({
        data: {
          date: booking.startDate,
          valueInCents: faker.number.int({ min: 1000, max: 5000 }),
          method: faker.helpers.arrayElement(['CREDIT', 'CASH', 'PIX']),
          bookingId: booking.id,
        },
      })
    )
  );

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
