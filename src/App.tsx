import { Pencil, Trash } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Field, FieldLabel } from "@/components/ui/field"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"

interface Expense {
  id: number
  label: string
  expense_date: string
  item_price: number
  currency: string
  amount: number
  unit: string
  category: string
}

// interface ExpenseCreate {
//   label: string
//   expense_date: string
//   item_price: number
//   currency: string
//   amount: number
//   unit: string
//   category: string
// }

const units = [
  { label: "Select a unit", value: null },
  { label: "KG", value: "kg" },
  { label: "Littre", value: "littre" },
  { label: "Bottle", value: "bottle" },
]

const currencies = [
  { label: "Select a currency", value: null },
  { label: "USD", value: "usd" },
  { label: "JOD", value: "jod" },
  { label: "ILS", value: "ils" },
]

const emptyExpense: Expense = {
  label: "",
  expense_date: "",
  item_price: 0,
  currency: "",
  amount: 0,
  unit: "",
  category: "",
  id: 0,
}

export function App() {
  const [expensesList, setExpensesList] = useState<Expense[]>([])
  const [formExpense, setFormExpense] = useState<Expense>(emptyExpense)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function loadExpenses() {
    const response = await fetch("http://localhost:8000/expenses", {
      method: "GET",
    })

    if (response.ok == false) {
      throw Error("There was an error in the server response")
    }

    const results = await response.json()

    setExpensesList(results)
  }

  async function removeExpense(id: number) {
    const response = await fetch("http://localhost:8000/expenses/" + id, {
      method: "DELETE",
    })

    if (response.ok == false) {
      throw Error("There was an error in the server response")
    }

    // loadExpenses()

    const filteredExpenses = expensesList.filter((item) => item.id != id)
    setExpensesList(filteredExpenses)
  }

  async function saveExpense() {
    let method = "POST"
    let url = "http://localhost:8000/expenses"
    if (formExpense.id) {
      method = "PATCH"
      url = "http://localhost:8000/expenses/" + formExpense.id
    }
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formExpense),
    })

    if (response.ok == false) {
      throw Error("There was an error in the server response")
    }

    // const newExpense = await response.json()

    // setExpensesList([...expensesList, newExpense])

    loadExpenses()

    setIsDialogOpen(false)
    setFormExpense(emptyExpense)
  }

  useEffect(() => {
    // async function init() {
    //   await loadExpenses()
    // }
    // init()
    // eslint-disable-next-line
    loadExpenses()
  }, [])

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={<Button>Add a new expense</Button>}
          ></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expenses Form</DialogTitle>
              <DialogDescription>
                Fill in the form below to add a new expense to your list.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <Field>
                <FieldLabel htmlFor="expense">Expense</FieldLabel>
                <Input
                  id="expense"
                  placeholder="Milk"
                  required
                  value={formExpense.label}
                  onChange={(e) =>
                    setFormExpense({ ...formExpense, label: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formExpense.expense_date}
                  onChange={(e) =>
                    setFormExpense({
                      ...formExpense,
                      expense_date: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  placeholder="1.5"
                  type="number"
                  required
                  value={formExpense.amount}
                  onChange={(e) =>
                    setFormExpense({
                      ...formExpense,
                      amount: parseInt(e.target.value),
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="unit">Unit</FieldLabel>
                <Select
                  items={units}
                  id="unit"
                  value={formExpense.unit}
                  onValueChange={(value) =>
                    setFormExpense({ ...formExpense, unit: value ? value : "" })
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="item_price">Price</FieldLabel>
                <Input
                  id="item_price"
                  placeholder="1.5"
                  type="number"
                  required
                  value={formExpense.item_price}
                  onChange={(e) =>
                    setFormExpense({
                      ...formExpense,
                      item_price: parseFloat(e.target.value),
                    })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="currency">Currency</FieldLabel>
                <Select
                  items={currencies}
                  id="currency"
                  value={formExpense.currency}
                  onValueChange={(value) =>
                    setFormExpense({
                      ...formExpense,
                      currency: value ? value : "",
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={saveExpense}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Table>
          <TableCaption>A list of your expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Expense</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expensesList.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.label}</TableCell>
                <TableCell>{expense.expense_date}</TableCell>
                <TableCell>
                  {expense.amount} {expense.unit}
                </TableCell>
                <TableCell>
                  {expense.item_price} {expense.currency}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setFormExpense(expense)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button onClick={() => removeExpense(expense.id)}>
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      .
    </div>
  )
}

export default App
