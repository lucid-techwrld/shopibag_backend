let uploadedImageUrl = null;

const addProduct = async (e) => {
  e.preventDefault();

  if (!uploadedImageUrl) {
    alert('Please upload an image first.');
    return;
  }

  const name = document.getElementById('name').value;
  const desc = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const quantity = document.getElementById('quantity').value;
  const category = document.getElementById('category').value;

  const productDetails = {
    name,
    description: desc,
    price,
    quantity,
    category,
    imageUrl: uploadedImageUrl, // ✅ use saved image
  };

  console.log(productDetails);
  
  try {
    console.log('Uploading product....')
    const res = await fetch('/api/v1/products/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(productDetails)
      })
    
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed: ${errText}`);
      }

    const data = await res.json()
    console.log(data)

  } catch (error) {
    console.log('Error uploading product', error.message)
  }
  // Now send productDetails to your backend/MongoDB
};




    const dropZone = document.getElementById('dropBox')
    const imageInput = document.getElementById('imageInput')
    const preview = document.getElementById('image-preview')

    dropZone.addEventListener('click', () => {
        console.log('clicked')
        imageInput.click()
    })

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation();
        console.log('over it')
    })
    dropZone.addEventListener('dragleave', () => console.log('ohh hell nooo'))
    
    dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      const dropFile = event.dataTransfer.files[0];
      handleFile(dropFile); // just preview
      handleImageUpload(dropFile); // upload once
    });
    
    imageInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      handleFile(file); // just preview
      handleImageUpload(file); // upload once
    });
    

const handleFile = (file) => {
        if(file) {
            const reader = new FileReader()
            
            reader.onload = (e) => {
                preview.src = e.target.result
            }
        
            reader.readAsDataURL(file)
        }
    }
    


const handleImageUpload = async (file) => {
  const formdata = new FormData();
  formdata.append('image', file);

  try {
    console.log('Uploading image...');
    const res = await fetch('/api/image/upload', {
      method: 'POST',
      body: formdata,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Upload failed: ${errText}`);
    }

    const data = await res.json();
    uploadedImageUrl = data.publicUrl; // ✅ Save it globally
    console.log('Uploaded successfully:', uploadedImageUrl);
    return uploadedImageUrl;
  } catch (error) {
    console.error('Upload Error:', error.message);
    alert('Failed to upload image. Please try again.');
    return null;
  }
};







