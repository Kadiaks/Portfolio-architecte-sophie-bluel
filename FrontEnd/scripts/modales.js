 // 1°)  a) Fonction qui va générer la galerie de photos à éditer dans la modale

 function generateModalWorks(works) {

    const gallery = document.querySelector('.gallery-modal');
    for (let i = 0; i < works.length; i++) {
           
        const figureElement = document.createElement('figure');
        figureElement.classList.add('id-' + works[i].id);
        figureElement.setAttribute("data-id", works[i].id)
        const imageElement = document.createElement('img');
        imageElement.src = works[i].imageUrl; 
        const iconElement = document.createElement('i');
        iconElement.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right hidden"></i><i class="fa-regular fa-trash-can"></i>'
        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.innerText = "éditer";   
        
        gallery.appendChild(figureElement);            
        figureElement.appendChild(imageElement);  
        figureElement.appendChild(figcaptionElement);
        figureElement.appendChild(iconElement)
    }
}

        //  b) Fonctions qui servent à jongler entre les 2 parties de la modale

function hideModeAjout() {
    const elementsAjout = Array.from(document.querySelectorAll(".mode-ajout"));
    for (let i = 0 ; i < elementsAjout.length ; i++) {
        elementsAjout[i].classList.add("hidden");
    };    
}

function hideModePresentation() {
    const elementsPresentation = Array.from(document.querySelectorAll(".mode-presentation"));
    for (let i = 0 ; i < elementsPresentation.length ; i++) {
        elementsPresentation[i].classList.add("hidden");
    };    
}

function showModeAjout() {
    const elementsAjout = Array.from(document.querySelectorAll(".mode-ajout"));
    for (let i = 0 ; i < elementsAjout.length ; i++) {
        elementsAjout[i].classList.remove("hidden");
    };    
}

function showModePresentation() {
    const elementsPresentation = Array.from(document.querySelectorAll(".mode-presentation"));
    for (let i = 0 ; i < elementsPresentation.length ; i++) {
        elementsPresentation[i].classList.remove("hidden");
    };    
}

 //  c) Fonction qui va générer l'icône fléchée au survol de chaque figure 

 function addArrowsToGalleryModale() {
    const figure = Array.from(document.querySelectorAll(".gallery-modal figure"));
    for (let i = 0 ; i < figure.length ; i++) {
        figure[i].addEventListener("mouseover", function() {
            const addArrows = this.querySelector('.fa-solid');
                addArrows.classList.remove('hidden')
        });

        figure[i].addEventListener("mouseout", function() {
            const addArrows = this.querySelector('.fa-solid');
                addArrows.classList.add('hidden')
        });
    }
}

   //  d) Fonction de suppression des élements grâce à l'API

   function deleteData(url, tokenKey) {
    const tokenResponse = JSON.parse(localStorage.getItem(tokenKey)).token;
    const deleteOptions = {
            method: 'DELETE',
            headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${tokenResponse}`
            }
        };
    return fetch(url, deleteOptions);
}

  //  e) Fonction qui va supprimer un seul élément la galerie
    
  function deleteElementFromGallery() {
    const supprElementGalerie = Array.from(document.querySelectorAll(".gallery-modal figure .fa-regular"));
    for (let i = 0 ; i < supprElementGalerie.length ; i++) {
        supprElementGalerie[i].addEventListener("click", async function() {
            const figure = this.parentElement.parentElement;
            const id = figure.getAttribute("data-id");
    
            try {
                const response = await deleteData(`http://localhost:5678/api/works/${id}`, "tokenResponse")
    
                if (!response.ok) {
                    throw new Error("Impossible d'effacer ce projet");
                }
                figure.remove();
    
                const backgroundFigure = Array.from(document.querySelectorAll('.gallery figure'));
                    for (let i = 0; i < backgroundFigure.length; i++) {
                        const backgroundFigureId = backgroundFigure[i].getAttribute("data-id");
                        if (backgroundFigureId === id) {
                            try {
                                const response = await deleteData(`http://localhost:5678/api/works/${id}`, "tokenResponse")
    
                                if (!response.ok) {
                                 throw new Error("Impossible d'effacer ce projet");
                            }
                            backgroundFigure[i].remove();
    
                            } catch(error) {
                                window.alert("Opération impossible")
                            }
                        } 
                    }
            } catch(error) {
                window.alert("Opération impossible")
            }
        });
    }
}

        //  f) Fonction d'import d'une nouvelle photo

function importNewPhoto() {
    const editNewPhoto = document.querySelector('.image-custom');
    const newPhoto = document.createElement('img');
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    const maxPhotoSize = 4 * 1024 * 1024; // ici 4x 1024ko x 1024 octets
    if (file.size > maxPhotoSize) {
        alert('Taille de 4go dépassée !');
        fileInput.value = ''; // permet à l'utilisateur de sélectionner un nouveau fichier
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        newPhoto.src = e.target.result; 
        editNewPhoto.appendChild(newPhoto);
    }

    reader.readAsDataURL(file)
}

        //  g) Fonction d'ajout d'un nouveau projet

function addData(url, formData, tokenKey) {
    const tokenResponse = JSON.parse(localStorage.getItem(tokenKey)).token;
    const addOptions = {
            method: 'POST',
            headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${tokenResponse}`
            },
            body: formData
        };
    return fetch(url, addOptions);
}

        //  h) Fonction de rechargement du label-image

function resetImage() {
    const removeImages = document.querySelectorAll(".image-custom img");
    const reloadCustomElements = document.querySelectorAll('.image-custom-element');
  
    removeImages.forEach(image => {
      image.classList.add("hidden");
    });
  
    reloadCustomElements.forEach(customElement => {
      customElement.classList.remove("hidden");
    });
}

document.addEventListener("DOMContentLoaded", async function() {

    // 2°) Ouverture de la modale en appuyant sur "modifier"

const btnModifier = document.querySelectorAll(".modifier")

btnModifier.forEach(function(button) {
    button.addEventListener("click", function() {
        const showModal = document.querySelector('.modal');
        showModal.classList.remove("hidden");
        showModePresentation()
        hideModeAjout()
    })
});

    // 3°) Appel à l'API et à la fonction pour générer la galerie de travaux dans la modale

try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    generateModalWorks(works)
} catch(error) {
    window.alert("Impossible de récupérer les travaux");
}

    // 4°) Générer l'icône fléchée au survol de chaque figure 

addArrowsToGalleryModale();

    // 5°)  a) fermer la modale en appuyant sur X

const btnX = document.querySelector(".fa-solid.fa-x");
const quitModal = document.querySelector('.modal');

btnX.addEventListener("click", function() {
    quitModal.classList.add("hidden")
});

})
