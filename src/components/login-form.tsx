import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { verifySession } from "@/app/dashboard/verify-session";
import { getBarberData } from "@/lib/barber-data";
import BarberLoginClient from "@/app/dashboard/BarberLoginClient";

export async function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const decodedClaims = await verifySession();
  
    if (decodedClaims) {
      const barberData = await getBarberData(decodedClaims.uid);
      return (
        <>
        {barberData && (
        <div className="flex flex-col mx-auto max-w-7xl p-4">
          <BarberLoginClient user={decodedClaims} barberData={barberData} />
        </div>
        )}
        </>
      );
    }
  
    return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-row gap-4">
                  <BarberLoginClient user={null} barberData={null}/>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing in, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
