import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function DialogREcuperarSenha() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-start px-1 text-xs my-2 font-medium text-ring underline-offset-4 hover:underline"
        >
          Esqueci minha senha
        </Button>
      </DialogTrigger>
      <DialogContent className=" mx-4">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl text-primary">
            Xiii... Esqueceu sua senha?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-justify text-lg">
          Envie um e-mail para{" "}
          <span className="font-bold">pginova@pge.rj.gov.br </span>com o assunto{" "}
          <span className="font-bold">recuperar senha </span> e com o e-mail que
          gostaria de recuperar a senha no corpo do e-mail.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button size={"lg"}>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
