import { ExerciseData } from "../../@types/Exercise/Index";
import { Exercise } from "../../database/schemas/Exercises";

class ExerciseController {
    constructor() {

    }

    create(data: ExerciseData) {
        return new Promise((resolve, reject) => {
            Exercise.create(data)
            .then((data) => {
                data.save()

                resolve(true)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
}

export default ExerciseController