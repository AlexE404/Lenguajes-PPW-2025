const express = require('express');
const xlsx = require('xlsx');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/guardar-cotizacion', (req, res) => {
  const nuevaCotizacion = req.body;
  const archivo = 'cotizaciones.xlsx';

  let datos = [];
  try {
    const workbook = xlsx.readFile(archivo);
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    datos = xlsx.utils.sheet_to_json(hoja);
  } catch (err) {
    console.log('No hay archivo, se creará uno nuevo.');
  }

  nuevaCotizacion.productos.forEach(p => {
    datos.push({
      Nombre: nuevaCotizacion.nombre,
      Ciudad: nuevaCotizacion.ciudad,
      Dirección: nuevaCotizacion.direccion,
      Celular: nuevaCotizacion.celular,
      Producto: p.nombre,
      Cantidad: p.cantidad,
      Precio: p.precio,
      Total: p.total
    });
  });

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(datos);
  xlsx.utils.book_append_sheet(wb, ws, 'Cotizaciones');
  xlsx.writeFile(wb, archivo);

  res.sendStatus(200);
});

// ✅ Nueva ruta para obtener cotizaciones
app.get('/cotizaciones', (req, res) => {
  try {
    const workbook = xlsx.readFile('cotizaciones.xlsx');
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(hoja);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo leer el archivo de cotizaciones.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
