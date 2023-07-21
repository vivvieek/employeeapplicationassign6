const express=require('express');
const morgan=require('morgan');
const mongoose=require('mongoose');
const cors=require('cors');
const jwt=require('jsonwebtoken');
const app=new express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const url = 'mongodb+srv://spvivekbabu:fsda123@cluster0.h7vuisq.mongodb.net/';
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log('Connected to MongoDB Atlas');
})
.catch((error)=>{
    console.error('MongoDB Atlas connection error:',error);
});

// schema
const employeedSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
});

// model
const Employee = mongoose.model('Employeedetail', employeedSchema);

// verify token
function verifytoken(req,res,next){
  try {
    if(!req.headers.authorization) throw 'Unauthorized';
    let token=req.headers.authorization.split('')[1];
    if(!token) throw 'Unauthorized';
    let payload=jwt.verify(token,'secretKey');
    if(!payload) throw 'Unauthorized';
    res.status(200).send(payload);
    next()
    } catch (error) {
      res.status(404).send({message:'Not Found'})
  }
}

// login verification
app.post('/login',async(req,res)=>{
  try {
    console.log(req.body);
    var email=req.body.email;
    var pass=req.body.password;
    if((email=="admin@employee.com"&&pass=="admin123")){
      let payload={email:email,password:pass};
      let token=jwt.sign(payload,'secretkey');
      res.status(200).send({message:'Success',token:token});
    }
    else if(email=="user@employee.com"&&pass=="user123"){
      let payload={email:email,password:pass};
      let token=jwt.sign(payload,'secretkey');
      res.status(200).send({message:'Success',token:token});
    }
    else{
      res.status(404).send({message:'Unauthorised'});
    }
  } catch (error) {
      res.status.send(404)({message:'Not Found'});

  }
})

// app.post('/add',verifytoken,(req,res)=>{
//   console.log(req.headers.authorization);
//   res.status(200).send({message:'Success'});
// })

// add data
app.post('/add',(req,res)=>{
  console.log(req.body);
  const newEmployee = new Employee({
    id:req.body.id,
    name: req.body.name,
    email: req.body.email
  });
  newEmployee.save()
    .then(()=>{
      res.status(200).json({message:'Employee saved successfully'});
    })
    .catch((error)=>{
      res.status(500).json({error: 'Failed to save employee'});
    });
});

// view data
app.get('/employeelist',(req, res)=>{
  Employee.find()
  .then((employees)=>{
    res.status(200).json(employees);
  })
  .catch((error)=>{
    res.status(500).json({error:'Failed to fetch employees'});
  });
});

// view single data
app.get('/getone/:_id',(req,res)=>{
  let data=Employee.findById(req.params._id)
  .then((data)=>{
    res.status(200).json({data});
    res.json({data:data, status: 200}).status(200)
  })
  .catch((error)=>{
    res.status(500).json({error:'Failed to fetch employees'});
  });
});

// edit data
app.put('/edititem/:_id', async(req,res)=>{
  console.log(req.body);
  const updateFields={
    id:req.body.id,
    name: req.body.name,
    email: req.body.email
  };
  await Employee.findByIdAndUpdate(req.body.id, { $set: updateFields }, { new: true })
    .then((employee)=>{
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ error: 'Employee not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to update employee' });
    });
});

// delete data
app.delete('/deleteitem/:_id',(req, res) => {
  Employee.findByIdAndRemove(req.params._id)
  .then((employee)=>{
    if (employee){
      res.status(200).json({message:'Employee deleted successfully'});
    }else{
      res.status(404).json({error:'Employee not found'});
    }
  })
  .catch((error)=>{
    res.status(500).json({error:'Failed to delete employee'});
  });
});





// edit data
// app.put('/api/employees/:id', verifytoken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, age, place, salary } = req.body;
//     const employee = await Employee.findById(id);
//     if (!employee) {
//       return res.status(404).json({ error: 'Employee not found' });
//     }
//     employee.name = name;
//     employee.age = age;
//     employee.place = place;
//     employee.salary = salary;
//     await employee.save();
//     res.status(200).json({ message: 'Employee updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



app.listen(3000,()=>{
  console.log("server running")
})



























// const express=require('express')
// const app=new express()
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))

// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

// const morgan=require('morgan')
// app.use(morgan('dev'))

// const cors=require('cors')
// app.use(cors())

// const PORT=3000;
// app.listen(PORT,()=>{
//     console.log(`Server is running on code ${PORT}`);
// });

// const mongoose=require('mongoose');
// const url = 'mongodb+srv://spvivekbabu:Fsda123@cluster0.h7vuisq.mongodb.net/';
// mongoose.connect(url,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(()=>{
//     console.log('Connected to MongoDB Atlas');
// })
// .catch((error)=>{
//     console.error('MongoDB Atlas connection error:',error);
// });

// // Schema
// const employeedataSchema = new mongoose.Schema({
//     ID: Number,
//     Name: String,
//     Email: String,
// });

// // Model
// const Employee = mongoose.model('Employee', employeedataSchema);

// // Get
// app.get('/api/employeelist/:id',(req, res)=>{
//     Employee.findById(req.params.id)
//     .then((employee) => {
//       if (employee) {
//         res.status(200).json(employee);
//       } else {
//         res.status(404).json({ error: 'Employee not found' });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Failed to fetch employee' });
//     });
//   });