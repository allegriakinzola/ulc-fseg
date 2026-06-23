import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "./sign-in-form";

export const metadata = { title: "Connexion" };

export default function SignInPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">
        Connexion
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Accédez à votre espace ULC-FSEG.
      </p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
      {/* <p className="mt-6 text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link href="/sign-up" className="font-semibold text-navy hover:text-gold-dark">
          Créer un compte
        </Link>
      </p> */}
    </div>
  );
}
