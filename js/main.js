
function getFetch(){
  let choice = document.getElementById('barcode').value
  const url = `https://world.openfoodfacts.org/api/v0/product/${choice}.json`

  if (choice.length !== 12) {
    alert ('Barcodes should be 12 characters long')
    return
  }

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (data.status === 1) {
          const item = new ProductInfo(data.product)
          item.showInfo()
          item.listIngredients()
        } else if (data.status === 0) {
          alert(`Product ${choice} not found. Try a different barcode`)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //passing in data.product
    this.name = productData.product_name
    this.image = productData.image_front_url
    this.ingredients = productData.ingredients
    this.gluten = productData.labels
  }
  
  showInfo() {
    document.querySelector('h2').innerText = this.name
    document.getElementById('product-image').src = this.image
    if (this.gluten.includes('Gluten-free')) {
      document.querySelector('span').innerText = 'YES'
    } else {
      document.querySelector('span').innerText = 'NO'
    }
  }

  listIngredients() {
    let tableRef = document.getElementById('ingredients-table')

    //clear the table
    for (let i = 1; i < tableRef.rows.length; i++) {
      tableRef.deleteRow(i)
    }

    if (!(this.ingredients == null)) {
    //add ingredients to table
      for (let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1)
        let newICell = newRow.insertCell(0)
        let newVCell = newRow.insertCell(1)
        let newIText = document.createTextNode(this.ingredients[key].text)
        
        // load vegan status 
        let veganStatus = !(this.ingredients[key].vegan) ? 'unknown' : this.ingredients[key].vegan
        let newVeganStatursText = document.createTextNode(veganStatus)
        
        //put the text into the cell
        newICell.appendChild(newIText)
        newVCell.appendChild(newVeganStatursText)

        //turn yellow/red
        if (veganStatus === 'no') {
          //turn red
          newVCell.classList.add('non-veg-item')
        } else if (veganStatus === 'unknown' || veganStatus === 'maybe') {
          //turn blue
          newVCell.classList.add('unknown-maybe-item')
        }
      }
    }
  }
}