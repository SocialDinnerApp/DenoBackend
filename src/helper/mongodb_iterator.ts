import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";

export class Iterator {

    today = new Date();

    // iterates over the participant collection to get data for a visualization of participants 
    // accumulated over a "step_size" of days, starting on the value of "start_Date" days ago
    public async mongodbIterator(step_size: number, start_Date: number, collection: any, id: string) {

        let countArray: any = []
        let dates: any = [];

        const newDate = new Date(this.today);
        let date_before = new Date(newDate.setDate(newDate.getDate() - start_Date+1));
        
        for(let count=0; count<start_Date;){
            var counter = 0
            if(count==0){
              let converted_date = format(date_before, "dd.MM.yyyy");
              dates.push(converted_date)
            }
            for(let i=0; i<step_size; i++){
              var docs = await collection.aggregate([
                { $match: { datetime_created:  format(date_before, "yyyy-MM-dd"), eventId: id} },
                { $group: { _id: "$name", total: { $sum: 1 } } },]).toArray() as any;
                if(Object.keys(docs).length != 0){
                    let count = docs[0].total
                    counter += count*2
                    date_before = new Date(newDate.setDate(newDate.getDate() + 1));
                } else {
                  date_before = new Date(newDate.setDate(newDate.getDate() + 1));
                  counter += 0
                }
            }
            count += step_size
            let converted_date = format(date_before, "dd.MM.yyyy");
            dates.push(converted_date);
            countArray.push(counter)
          }
          dates.pop();
          return [countArray, dates]
    }

}