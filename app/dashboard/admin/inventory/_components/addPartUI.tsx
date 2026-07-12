"use client"

import {addPart} from "../actions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddPartUI(){
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    
    const rawCars = formData.get("carsForPart") as string;
    const compatible_cars = rawCars
    .split(" ")
    .map(car => car.trim())
    .filter(car => car.length > 0)
    // تجميع البيانات من النموذج
    const data = {
      name: formData.get("namePart") as string,
      stock_qty: parseInt(formData.get("qtyPart") as string),
      base_price: parseFloat(formData.get("pricePart") as string),
      compatible_cars,
      image_url: formData.get("urlIMG") as string,
    }

    // إرسال البيانات إلى الخادم
    const response = await addPart(data)
    

    // if (response.success) {
    //   setMessage({ type: "success", text: "تم تسجيل العميل والمركبة بنجاح برقم ملف واحد!" })
    //   e.currentTarget.reset() // تفريغ الحقول بعد النجاح
    // } else {
    //   setMessage({ type: "error", text: response.error || "حدث خطأ ما" })
    // }
  }
 return(
    <>
    <div>
        {/* <form onSubmit={handleSubmit}>
            <input type="text" name="namePart" placeholder="Name of part"/>
            <input type="number" name="qtyPart" placeholder="qty of part"/>
            <input type="number" name="pricePart" placeholder="price of part"/>
            <input type="text" name="carsForPart" placeholder="cars for part"/>
            <input type="text" name="urlIMG" placeholder="url for part"/>
            <button type="submit">send</button>
        </form> */}

       <form onSubmit={handleSubmit} className="w-full max-w-sm bg-amber-50 justify-center m-auto">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">اسم القطعة</FieldLabel>
          <Input
            id="form-name"
            type="text"
            placeholder="زيت ، شمعة ..."
            name="namePart"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-email">عدد القطعة</FieldLabel>
          <Input
           id="form-email"
           type="number"
           placeholder="2،3،4،..."
           name="qtyPart"
           required
           />
          <FieldDescription>
            يرجى تسجيل ارقام فقط دون احرف مثال على مئة قطعة ( 100 )
          </FieldDescription>
        </Field>
        <div className="">
          <Field>
            <FieldLabel htmlFor="form-phone">سعر القطعة</FieldLabel>
            <Input 
            id="form-phone" 
            type="number" 
            placeholder="100،50،60،..." 
            name="pricePart"
            required
            />
            <FieldDescription>
            يرجى تسجيل سعر القطعة بالارقام فقط كمثال مئة ريال ( 100 )
            </FieldDescription>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="form-address">القطعة مخصصة لمركبة</FieldLabel>
          <Input 
          id="form-address" 
          type="text" 
          placeholder="تويوتا ، هونداي" 
          name="carsForPart"
          required
          />
          <FieldDescription>
          يرجى تسجيل المركبة كتالي ( تويوتا ) وعندما القطعة تاتي لأكثر من شركة كتابتها كالتالي ( تويوتا هوندا ) وضع مسافة بينهم فقط
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="form-address">رابط صورة القطعة</FieldLabel>
          <Input 
          id="form-address" 
          type="text" 
          placeholder="https://link.com/img.png" 
          name="urlIMG"
          required
          />
          <FieldDescription>
          يرجى التأكد بان رابط الصورة ينتهي بصيغة الصورة مثال (.png , .jpg , etc ...)
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Button type="reset" variant="outline">
            مسح الكل
          </Button>
          <Button type="submit">إرسال</Button>
        </Field>
      </FieldGroup>
    </form> 
    </div>
    </>
 )   
}