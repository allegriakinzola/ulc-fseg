import Link from "next/link";
import { SignUpForm } from "./sign-up-form";

export const metadata = { title: "Créer un compte" };

export default function SignUpPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-navy">
        Créer un compte
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Rejoignez l&apos;espace FSEG-ULC.
      </p>
      <div className="mt-8">
        <SignUpForm />
      </div>
      <p className="mt-6 text-sm text-slate-600">
        Déjà inscrit·e ?{" "}
        <Link href="/sign-in" className="font-semibold text-navy hover:text-gold-dark">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
