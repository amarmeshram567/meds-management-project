import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface AddMedicineFormProps{
    onAdded: () => void;
}


const AddMedication = ({onAdded}: AddMedicineFormProps) => {

    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequency, setFrequency] = useState("");

    const {axios} = useAppContext()

    const handleAddMedicine = async () => {
        if (!name || !dosage || !frequency) {
            toast.error("All Fields are required!")
            return;
        }

        try {

            const token = localStorage.getItem('token')

            const res = await axios.post("/api/medications/add-medicine", {
                name, dosage, frequency
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            );

            if (res.data.success){
                toast.success("Medicine added successfully")
                setName("")
                setDosage("")
                setFrequency("");
                onAdded();
            }
            else {
                toast.error("failed to adding medicine")
            }

        } catch (error) {
            toast.error(error)
        }
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Medication</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={(e) => {
            e.preventDefault();
            handleAddMedicine();
        }}>
            
            <div>
                <label htmlFor="name">Medicine Name</label>
                <input onChange={(e) => setName(e.target.value)} value={name}  type="text" id='name' className='w-full border-gray-200 border rounded-lg p-2 mt-1 outline-primary ' placeholder='type here' />
            </div>

            <div>
                <label htmlFor="frequency">Frequency</label>
                <input  onChange={(e) => setFrequency(e.target.value)} value={frequency}  type="text" id='frequency' className='w-full border-gray-200 border rounded-lg p-2 mt-1 outline-primary ' placeholder='type here' />
            </div>

            <div>
                <label htmlFor="dosage">Dosage</label>
                <input onChange={(e) => setDosage(e.target.value)} value={dosage} type="text" id='dosage' className='w-full border-gray-200 border rounded-lg p-2 mt-1 outline-primary ' placeholder='type here' />
            </div>

        

        <Button className='mt-3' type='submit'>Add Medicine</Button>

        </form>
        
      </CardContent>
    </Card>
  );
}

export default AddMedication;
