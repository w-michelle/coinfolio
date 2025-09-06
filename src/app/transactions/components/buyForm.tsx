import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { buyAsset } from "./buyAsset";
import Input from "@/components/auth/Input";
import { FaAngleDown } from "react-icons/fa";
import { portfolioOptions } from "@/data/queries";

interface PortfolioProps {
  id: number;
  userId: string;
  balance: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface CryptoListProps {
  ID: number;
  NAME: string;
  PRICE_USD: number;
  SYMBOL: string;
  LOGO_URL: string;
}

export const BuyForm = ({
  data,
  list,
}: {
  data: PortfolioProps;
  list: CryptoListProps[];
}) => {
  const queryClient = useQueryClient();

  const [price, setPrice] = useState<number | null>(null);
  const [total, setTotal] = useState(0);

  const formSchema = z.object({
    symbol: z.string().min(1, { message: "Please select a crypto asset" }),
    quantity: z
      .number({ message: "Quantity must be a number" })
      .positive({ message: "Quantity must be greater than 0" })
      .refine(
        (val) =>
          Number.isFinite(val) && val.toString().split(".")[1]?.length <= 8,
        { message: "Maximum 8 decimal places allowed" }
      ),
    price: z.number(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      quantity: 0,
    },
  });

  const [state, execute, isPending] = useActionState(buyAsset, null);

  const onSubmit = (fdata: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("symbol", fdata.symbol);
    formData.append("quantity", fdata.quantity.toString());
    formData.append("price", fdata.price.toString()); //formData.append expects string or blob not a number for price and quantity
    formData.append("total", total.toString());

    startTransition(() => {
      execute(formData);
      reset();
      setPrice(null);
      setTotal(0);
    });
  };
  const handleTicker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const symbol = e.target.value;
    if (!symbol) {
      setPrice(null);
    } else {
      console.log(!symbol);
      const item = list.find((i) => i.SYMBOL === symbol);
      if (item) setPrice(item.PRICE_USD);
    }
  };

  const handleTotal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    const calculateTotal = Number(val) * Number(price);
    setTotal(calculateTotal);
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
      <h3 className="text-neutral-700 font-bold tracking-wider">BUY</h3>
      <div>
        <label htmlFor="">Balance</label>
        <div className="outline-none border-[1px] py-2 px-3 w-full rounded-md mt-2 border-neutral-400">
          ${data?.balance}
        </div>
      </div>
      <div className="relative">
        <label htmlFor="">Ticker</label>
        <select
          {...register("symbol")}
          onChange={(e) => handleTicker(e)}
          className="relative outline-none border-[1px] py-2 px-3 w-full rounded-md border-neutral-400 appearance-none"
        >
          <option value="">-- Select a ticker --</option>
          {list.map((item) => (
            <option
              key={item.ID}
              value={item.SYMBOL}
            >
              {item.SYMBOL}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 translate-y-1/6 inset-y-0 flex items-center">
          <FaAngleDown />
        </span>
      </div>
      {price && (
        <div>
          <label htmlFor="">Price</label>
          <input
            value={price}
            {...register("price", { valueAsNumber: true })}
            className="outline-none border-[1px] py-2 px-3 w-full rounded-md mt-2 border-neutral-400"
            id="price"
            readOnly
          />
        </div>
      )}

      <Input
        type="number"
        label="Quantity"
        step="any"
        placeholder="ex. 10000"
        id="quantity"
        register={register("quantity", {
          valueAsNumber: true,
          onChange: (e) => handleTotal(e),
        })}
        error={errors.quantity}
        disabled={!price}
      />
      <p className="font-bold tracking-wider">Total: ${total}</p>
      <button
        type="submit"
        className="py-2 px-4 bg-cgreen text-black hover:bg-cdarkGreen hover:text-cgreen hover:cursor-pointer"
      >
        Confirm
      </button>
      {isPending && <p>Processing...</p>}
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
};
