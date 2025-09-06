import Input from "@/components/auth/Input";
import { portfolioOptions } from "@/data/queries";
import { withdrawMoney } from "@/server/actions/withdrawMoney";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface PortfolioProps {
  id: number;
  userId: string;
  balance: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const WithdrawForm = ({ data }: { data: PortfolioProps }) => {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    amount: z
      .number({ message: "Amount must be a number" })
      .gt(1, { message: "Number must be greater than 1" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  //state is whatever is returned from addMoney function aka fromt he server
  //meanwhile formState:{errors} is for showing error for the inputs
  const [state, execute, isPending] = useActionState(withdrawMoney, null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("amount", data.amount.toString());
    startTransition(() => {
      execute(formData);
      reset();
    });
  };

  useEffect(() => {
    if (state?.success) {
      queryClient.invalidateQueries({
        queryKey: portfolioOptions(data.userId).queryKey,
      });
    }
  }, [state?.success]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <h3 className="text-neutral-700 font-bold tracking-wider">Withdraw</h3>
      <div>
        <label htmlFor="">Balance</label>
        <div className="outline-none border-[1px] py-2 px-3 w-full rounded-md mt-2 border-neutral-400">
          ${data.balance}
        </div>
      </div>
      <Input
        type="number"
        label="Amount"
        placeholder="ex. 10000"
        id="amount"
        register={register("amount", { valueAsNumber: true })}
        error={errors.amount}
      />
      <button
        type="submit"
        className="py-2 px-4 bg-cgreen text-black hover:bg-cdarkGreen hover:text-cgreen hover:cursor-pointer"
      >
        Confirm
      </button>
      {isPending && <p>Withdrawing...</p>}
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
};
