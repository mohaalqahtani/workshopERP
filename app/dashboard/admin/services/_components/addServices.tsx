"use client"

import {addServiceAction} from "../actions"
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

export default function AddServices(){
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    

    // تجميع البيانات من النموذج
    const data = {
      name: formData.get("nameServ") as string,
      description: formData.get("descServ") as string,
      required_mechanics: parseInt(formData.get("required_mechanics") as string),
      price: parseInt(formData.get("price") as string),
    }

    // إرسال البيانات إلى الخادم
    const response = await addServiceAction(data)
    

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
       <form onSubmit={handleSubmit} className="w-full max-w-sm bg-amber-50 justify-center m-auto">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="form-name">اسم الخدمة</FieldLabel>
          <Input
            id="form-name"
            type="text"
            placeholder="تغيير زيت ، تركيب شمعة ...."
            name="nameServ"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="form-email">وصف الخدمة</FieldLabel>
          <Input
           id="form-email"
           type="text"
           placeholder="تغيير زيت للمركبات جميع ، تغيير شمعة كامري ..."
           name="descServ"
           required
           />
          <FieldDescription>
          يرجى تسجيل الوصف بدقة بحيث يظهر للفني ويعرف الاختيار
          </FieldDescription>
        </Field>
        <div className="">
          <Field>
            <FieldLabel htmlFor="form-phone">عدد العاملين</FieldLabel>
            <Input 
            id="form-phone" 
            type="number" 
            placeholder="2,5,10,20 ..." 
            name="required_mechanics"
            required
            />
            <FieldDescription>
            عدد العاملين لإنجاز الخدمة 
            </FieldDescription>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="form-address">سعر الخدمة</FieldLabel>
          <Input 
          id="form-address" 
          type="number" 
          placeholder="150, 200, 250, 1000, 5000 ...." 
          name="price"
          required
          />
          <FieldDescription>
        وضع السعر كرقم فقط
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