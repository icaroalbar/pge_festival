import CardAuth from "@/components/ui/cardAuth";
import Icon from "@/components/ui/icons";

export default function EmailEnviado() {
  return (
    <CardAuth
      title="Email enviado!"
      description="Verifique sua caixa de entrada"
      linkTextFooter="Página inicial"
      hrefTextFooter="/"
      className="relative pt-24"
    >
      <div className="flex justify-center items-center">
        <Icon
          name="CircleCheck"
          className="bg-secondary text-muted rounded-full absolute top-5"
          size={80}
        />
      </div>
    </CardAuth>
  );
}
