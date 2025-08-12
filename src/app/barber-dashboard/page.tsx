import BarberLoginClient from './BarberLoginClient';
import { verifySession } from './verify-session';
import { getBarberData } from '@/lib/barber-data';

export default async function BarberDashboardPage() {
  const decodedClaims = await verifySession();

  if (decodedClaims) {
    const barberData = await getBarberData(decodedClaims.uid);
    return (
      <div className="flex flex-col mx-auto max-w-3xl p-4">
        <BarberLoginClient user={decodedClaims} barberData={barberData} />
      </div>
    );
  }

  return <BarberLoginClient user={null} barberData={null}/>;
}
