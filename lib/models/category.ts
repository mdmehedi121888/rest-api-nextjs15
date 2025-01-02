import { model, models, Schema } from "mongoose";


const categorySchema = new Schema(
    {
    title:{type:String, required:true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
},{
    timestamps: true
}
);


const Category = models.Category || model('Category', categorySchema);

export default Category;