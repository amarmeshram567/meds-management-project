import { initialDB } from "../config/db.js";


export const addMedications = async (req, res) =>  {
    
    try {
        const db  = await initialDB();

        const {name, dosage, frequency} = req.body;

        const userId = req.userId;

         if(!userId) {
            return res.json({success: false, message: "User ID is required"})
        }


        const result = await db.run(
            `INSERT INTO medications (user_id, name, dosage, frequency) VALUES (?, ?, ?, ?)`,
            [userId, name, dosage, frequency]
        )

       

        return res.json({
            success: true,
            message: "Medicine added successfully",
            data: {id: result.lastID, name, dosage, frequency, user_id: userId}
        })

    } catch (error) {
        console.error(error.message)
        res.json({success:false, message: "Failed to add medicine" })
    }
    
}

export const getMedications = async (req, res) => {
    try {
        const db = await initialDB();

        // const userId = req.userId;

        console.log("Authenticate : ", req.userId)

        if (!req.userId) {
            return res.json({success: false, message: "User not authenticated"})
        }

        const medications = await db.all('SELECT * FROM medications WHERE user_id = ?', [req.userId]);

        res.json({success: true, medications})

        console.log("fetching ", medications)

    } catch (error) {
        console.error(error.message)
        res.json({success: false, message: "Failed to fetch medications"})
    }
}


export const markMedicationTaken = async (req, res) => {
    
    try {
        const db = await initialDB()

        const medId = req.params.id;
        const userId = req.userId;

        const medication = await db.get(
                'SELECT * FROM medications WHERE id = ? AND user_id = ?', [medId, userId]
            )

        if(!medication) {
            return res.json({success: false, message: "Medication not found "})
        }

        await db.run(
            'INSERT INTO medication_logs (medication_id, name, dosage, frequency) VALUES (?, ?, ?, ?)',
            [medication.id, medication.name, medication.dosage, medication.frequency]
        )

        return res.json({success: true, message: "Medication marked as taken"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const getAdherence = async (req, res) => {

    try {
        const db = await initialDB()

        const userId = req.userId

        const medications = await db.all(
            'SELECT id FROM medications WHERE user_id = ?',
            [userId]
        );

        if (medications.length === 0) {
            return res.json({success: true, adherence: 0, streak: 0, missedThisMonth: 0, takenThisWeek: 0})
        }

        const medsId = medications.map(m => m.id).join(',')

        const logs = await db.all(
            `
                SELECT medication_id, COUNT(*) as taken 
                FROM medication_logs
                WHERE medication_id IN (${medsId})        
            `
        );

        const today = new Date()
        const takenDates = new Set(
            logs.map(log => {
                const d = new Date(log.taken_at);
                return isNaN(d) ? null : d.toISOString().split("T")[0]
            }).filter(Boolean)
        );

        // calculate current streak
        let streak = 0;
        const day = new Date(today);
        for (let i = 0; i < 30; i++) {
            const dateStr = day.toISOString().split("T")[0];
            if (takenDates.has(dateStr)) {
                streak ++;
            }
            else {
                break;
            }
            day.setDate(day.getDate() - 1) 
        }

        // Taken this week
        const takenThisWeek = logs.filter(log => {
            const logDate = new Date(log.taken_at);
            const daysAgo = (today - logDate) / (1000 * 60 * 60 * 24)
            return daysAgo < 7;
        }).length;


        // Missed this month (assuming daily meds)
        const now  = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const expectedThisMonth = medications.length  * daysInMonth;
        const takenThisMonth = logs.filter(log => {
            const logDate = new Date(log.taken_at);
            return logDate.getMonth() === month && logDate.getFullYear() === year;
        }).length;

        const missedThisMonth = expectedThisMonth - takenThisMonth


        // Adherence rate 
        const totalExpected = medications.length * 7 ;
        
        const adherence = totalExpected === 0 ? 0 : Math.round((logs.length / totalExpected) * 100); 

        res.json({success: true, adherence, streak, missedThisMonth, takenThisWeek})
        
    } catch (error) {
        console.error(error.message)
        res.json({success: true, message: error.message})
    }
}

// upload medicine ---> 
export const uploadPhoto = async (req, res) => {
    const medId = req.params.id;

    try {
        const db = await initialDB();

        const filename = `uploads/${req.file.filename}`

        await db.run(
            'INSERT INTO medication_logs (medication_id, photo) VALUES (?, ?)',
            [medId, filename],
        )

        res.json({success: true, message: 'Photo uploaded successfully'});
   
    } catch (error) {
        console.error(error.message)
        res.json({success: false, message: "Upload error"})
    }
}


