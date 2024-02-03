// Dynamic addition of works in the portfolio gallery of the page
// Getting existing works from api
fetch("http://localhost:5678/api/works") 
.then(function(response) {
	if(response.ok) {
		return response.json();
	}
})
.then(function(data) {
	let works = data;
	console.log(works);
	// Looping on each work
	works.forEach((work, index) => {
		// Creation <figure>
		let myFigure = document.createElement('figure');
		myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
		myFigure.setAttribute('id', `work-item-${work.id}`);
		// Creation <img>
		let myImg = document.createElement('img');
		myImg.setAttribute('src', work.imageUrl);
		myImg.setAttribute('alt', work.title);
		myFigure.appendChild(myImg);
		// Creation <figcaption>
		let myFigCaption = document.createElement('figcaption');
		myFigCaption.textContent = work.title;
		myFigure.appendChild(myFigCaption);
		// Adding the new <figure> into the existing div.gallery
		document.querySelector("div.gallery").appendChild(myFigure);
	});
})
.catch(function(err) {
	console.log(err);
});

// Adding filters of categories to filter work in the gallery
// Getting existing categories from api
fetch("http://localhost:5678/api/categories")
.then(function(response) {
	if(response.ok) {
		return response.json();
	}
})
.then(function(data) {
	let categories = data;
	categories.unshift({id: 0, name: 'Tous'});
	console.log(categories);
	// Looping on each category
	categories.forEach((category, index) => {
		// Creation <button> to filter
		let myButton = document.createElement('button');
		myButton.classList.add('work-filter');
		myButton.classList.add('filters-design');
		if(category.id === 0) myButton.classList.add('filter-active', 'filter-all');
		myButton.setAttribute('data-filter', category.id);
		myButton.textContent = category.name;
		// Adding the new <button> into the existing div.filters
		document.querySelector("div.filters").appendChild(myButton);
		// Click event <buttton> to filter
		myButton.addEventListener('click', function(event) {
			event.preventDefault();
			// Handling filters
			document.querySelectorAll('.work-filter').forEach((workFilter) => {
				workFilter.classList.remove('filter-active');
			});
			event.target.classList.add('filter-active');
			// Handling works
			let categoryId = myButton.getAttribute('data-filter');
			document.querySelectorAll('.work-item').forEach(workItem => {
				workItem.style.display = 'none';
			});
			document.querySelectorAll(`.work-item.category-id-${categoryId}`).forEach(workItem => {
				workItem.style.display = 'block';
			});
		});
	});
})
.catch(function(err) {
	console.log(err);
});

document.addEventListener('DOMContentLoaded', function() {

	// Vérifier si l'identifiant utilisateur est présent dans la base de stockage
	if(localStorage.getItem('token') != null && localStorage.getItem('userId') != null) {
		
        // Changer le visuel de la page en mode admin
		document.querySelector('body').classList.add('connected');
		let topBar = document.getElementById('top-bar');
		topBar.style.display = "flex";
		let filters = document.getElementById('all-filters');
		filters.style.display = "none";
		let space = document.getElementById('space-only-admin');
		space.style.paddingBottom = "100px";
		let introduction = document.getElementById('space-introduction-in-mode-admin');
		introduction.style.marginTop = "-50px";
	}

	// Cliquez sur déconnexion pour vous déconnecter
	document.getElementById('nav-logout').addEventListener('click', function(event) {
		event.preventDefault();
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		
        // Changer le visuel de la page lorsque l'on est déconnecté
		document.querySelector('body').classList.remove(`connected`);
		let topBar = document.getElementById('top-bar');
		topBar.style.display = "none";
		let filters = document.getElementById('all-filters');
		filters.style.display = "flex";
		let space = document.getElementById('space-only-admin');
		space.style.paddingBottom = "0";
	});

	// Ouverture de la modale avec le bouton "modifier" en mode admin, pour visualiser tous les travaux
	document.getElementById('update-works').addEventListener('click', function(event) {
		event.preventDefault();
		
        // Nouvelle récupération pour ajouter tous les travaux dans la modale "modale-works"
		fetch("http://localhost:5678/api/works")
		.then(function(response) {
			if(response.ok) {
				return response.json();
			}
		})
		.then(function(data) {
			let works = data;
			
            // Suppression d'anciens travaux
			document.querySelector('#modal-works.modal-gallery .modal-content').innerText = '';
			
            // Work en boucle
			works.forEach((work, index) => {
				
                // Création de la balise <figure>
				let myFigure = document.createElement('figure');
				myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
				myFigure.setAttribute('id', `work-item-popup-${work.id}`);
				
                // Création de la balise <img>
				let myImg = document.createElement('img');
				myImg.setAttribute('src', work.imageUrl);
				myImg.setAttribute('alt', work.title);
				myFigure.appendChild(myImg);
				
                // Création de la balise <figcaption>
				let myFigCaption = document.createElement('figcaption');
				myFigCaption.textContent = 'éditer';
				myFigure.appendChild(myFigCaption);
				
                // Création de l'icône de suppression
				let crossDragDrop = document.createElement('i');
				crossDragDrop.classList.add('fa-solid','fa-arrows-up-down-left-right', 'cross');
				myFigure.appendChild(crossDragDrop);
				
                // Création de l'icône de la corbeille
				let trashIcon = document.createElement('i');
				trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');
				myFigure.appendChild(trashIcon);
				
                // Gestion de la suppression
				trashIcon.addEventListener('click', function(event) {
					event.preventDefault();
					if(confirm("Voulez-vous supprimer cet élément ?")) {
						
                        // Fetch pour supprimer le travail dans la "modal-work" et dans la galerie de portfolio de la page
						fetch(`http://localhost:5678/api/works/${work.id}`, {
							method: 'DELETE',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + localStorage.getItem('token')
							}
						})
						.then(function(response) {
							switch(response.status) {
								case 500:
								case 503:
									alert("Comportement inattendu!");
								break;
								case 401:
									alert("Suppresion impossible!");
								break;
								case 200:
								case 204:
									console.log("Projet supprimé.");
									
                                    // Supprimer work de la page
									document.getElementById(`work-item-${work.id}`).remove();
									console.log(`work-item-${work.id}`);
									
                                    // Supprimer work de la fenêtre contextuelle
									document.getElementById(`work-item-popup-${work.id}`).remove();
									console.log(`work-item-popup-${work.id}`);
								break;
								default:
									alert("Erreur inconnue!");
								break;
							}
						})
						.catch(function(err) {
							console.log(err);
						});
					}
				});
				
                // Ajout de la nouvlle balise <figure> dans le contenu div.modal existant
				document.querySelector("div.modal-content").appendChild(myFigure);
				
                // Ouverture de la modale "modal-works" 
				let modal = document.getElementById('modal');
				modal.style.display = "flex";
				let modalWorks = document.getElementById('modal-works');
				modalWorks.style.display = "block";
			});
		})
		.catch(function(err) {
			console.log(err);
		});
	});

	
    // Gestion de la fermeture modale en cliquant à l'extérieur
	// La modale "modal-works" ne peut pas se fermer en cliquant à l'intérieur de son contenu
	document.querySelectorAll('#modal-works').forEach(modalWorks => {
		modalWorks.addEventListener('click', function(event) {
			event.stopPropagation();
		});
		
        // La modale "modal-edit" ne peut pas se fermer en cliquant à l'intérieur de son contenu
		document.querySelectorAll('#modal-edit').forEach(modalEdit => {
			modalEdit.addEventListener('click', function(event) {
				event.stopPropagation();
			});

			// Fermer les deux fenêtres modales avec un clic extérieur
			document.getElementById('modal').addEventListener('click', function(event) {
				event.preventDefault();
				let modal = document.getElementById('modal');
				modal.style.display = "none";
				let modalWorks = document.getElementById('modal-works');
				modalWorks.style.display = "none";
				let modalEdit = document.getElementById('modal-edit');
				modalEdit.style.display = "none";
				
                // Réinitialiser tout le formulaire dans la modification modale 
				// Supprimer l'image si elle existe
				if(document.getElementById('form-image-preview') != null) {
					document.getElementById('form-image-preview').remove();
				}

				// Revenir à la conception originale du formulaire
				document.getElementById('modal-edit-work-form').reset();	
				let iconNewPhoto = document.getElementById('photo-add-icon');
				iconNewPhoto.style.display= "block";
				let buttonNewPhoto = document.getElementById('new-image');
				buttonNewPhoto.style.display= "block";
				let photoMaxSize = document.getElementById('photo-size');
				photoMaxSize.style.display= "block";	
				let modalEditPhoto = document.getElementById('modal-edit-new-photo');
				modalEditPhoto.style.padding = "30px 0 19px 0";
				document.getElementById('submit-new-work').style.backgroundColor= "#A7A7A7";
			});
		});
	});

	// Fermeture de la première fenêtre de la modale avec le bouton "x"
	document.getElementById('button-to-close-first-window').addEventListener('click', function(event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
	});

	// Fermeture de la deuxième fenêtre de la modale avec le bouton "x"
	document.getElementById('button-to-close-second-window').addEventListener('click', function(event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
		
        // Réinitialiser tout le formulaire dans la modification modale
		// Supprimer l'image si elle existe
		if(document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		
        // Revenir à la conception originale du formulaire
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display= "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display= "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display= "block";	
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 19px 0";
		document.getElementById('submit-new-work').style.backgroundColor= "#A7A7A7";
	});

	// Ouvrir la deuxième fenêtre de la modale avec le bouton "Ajouter photo"
	document.getElementById('modal-edit-add').addEventListener('click', function(event) {
		event.preventDefault();
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "block";
	});

	// Retourner à la première fenêtre de la modale avec la flèche
	document.getElementById('arrow-return').addEventListener('click', function(event) {
		event.preventDefault();
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "block";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
		
        // Réinitialiser tout le formulaire dans la modification modale 
		// Supprimer l'image si elle existe
		if(document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		
        // Revenir à la conception originale du formulaire
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display= "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display= "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display= "block";	
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 19px 0";
		document.getElementById('submit-new-work').style.backgroundColor= "#A7A7A7";
	});
	
	// Récupérer pour ajouter des options de catégorie dans la modification modale
	fetch("http://localhost:5678/api/categories")
		.then(function(response) {
			if(response.ok) {
				return response.json();
			}
		})
		.then(function(data) {
			let categories = data;
			
            // Boucle sur chaque catégorie
			categories.forEach((category, index) => {
			
            // Création <options> en édition modale
			let myOption = document.createElement('option');
			myOption.setAttribute('value', category.id);
			myOption.textContent = category.name;
			
            // Ajout du nouveau <option> dans la catégorie select.choice existante
			document.querySelector("select.choice-category").appendChild(myOption);
			});
		})
		.catch(function(err) {
			console.log(err);
		});

	// Formulaire de traitement
	document.getElementById('modal-edit-work-form').addEventListener('submit', function(event) {
		event.preventDefault();
		let formData = new FormData();
		formData.append('title', document.getElementById('form-title').value);
		formData.append('category', document.getElementById('form-category').value);
		formData.append('image', document.getElementById('form-image').files[0]);
		
        // Nouvelle récupération pour publier un nouveau work
		fetch('http://localhost:5678/api/works', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('token'),
			},
			body: formData
		})
		.then(function(response) {
			switch(response.status) {
				case 500:
				case 503:
					alert("Erreur inattendue!");
				break;
				case 400:
				case 404:
					alert("Impossible d'ajouter le nouveau projet!");
				break;
				case 200:
				case 201:
					console.log("Projet ajouté avec succés!");
					return response.json();
				break;
				default:
					alert("Erreur inconnue!");
				break;
			}
		})
		.then(function(json) {
			console.log(json);
			
            // Création d'un élément HTML
			// Création de <figure>
			let myFigure = document.createElement('figure');
			myFigure.setAttribute('class', `work-item category-id-0 category-id-${json.categoryId}`);
			myFigure.setAttribute('id', `work-item-${json.id}`);
			
            // Création de <img>
			let myImg = document.createElement('img');
			myImg.setAttribute('src', json.imageUrl);
			myImg.setAttribute('alt', json.title);
			myFigure.appendChild(myImg);
			
            // Création de <figcaption>
			let myFigCaption = document.createElement('figcaption');
			myFigCaption.textContent = json.title;
			myFigure.appendChild(myFigCaption);
			
            // Ajout du nouveau <figure> dans la div.gallery existante
			document.querySelector("div.gallery").appendChild(myFigure);
			
            // Fermer le mode d'édition
			let modal = document.getElementById('modal');
			modal.style.display = "none";
			let modalEdit = document.getElementById('modal-edit');
			modalEdit.style.display = "none";
			
            // Réinitialiser tout le formulaire dans la modification modale
			// Supprimer l'image si elle existe
			if(document.getElementById('form-image-preview') != null) {
				document.getElementById('form-image-preview').remove();
			}
			
            // Revenir à la conception originale du formulaire
			document.getElementById('modal-edit-work-form').reset();
			let iconNewPhoto = document.getElementById('photo-add-icon');
			iconNewPhoto.style.display= "block";
			let buttonNewPhoto = document.getElementById('new-image');
			buttonNewPhoto.style.display= "block";
			let photoMaxSize = document.getElementById('photo-size');
			photoMaxSize.style.display= "block";	
			let modalEditPhoto = document.getElementById('modal-edit-new-photo');
			modalEditPhoto.style.padding = "30px 0 19px 0";
			document.getElementById('submit-new-work').style.backgroundColor= "#A7A7A7";
		})
		.catch(function(err) {
			console.log(err);
		});
	});

	// Vérifier la taille du fichier image
	document.getElementById('form-image').addEventListener('change', () => {
		let fileInput = document.getElementById('form-image');
		const maxFileSize = 4 * 1024 * 1024; // 4MB
		if(fileInput.files[0].size > maxFileSize) {
			alert("Le fichier sélectionné est trop volumineux. La taille maximale est de 4 Mo.");
			document.getElementById('form-image').value = '';
		}
		else {
			if(fileInput.files.length > 0) {
            	
                // Création de l'aperçu de l'image
				let myPreviewImage = document.createElement('img');
				myPreviewImage.setAttribute('id','form-image-preview');
				myPreviewImage.src = URL.createObjectURL(fileInput.files[0]);
				document.querySelector('#modal-edit-new-photo').appendChild(myPreviewImage);
				myPreviewImage.style.display = "block";	
				myPreviewImage.style.height ="169px";
				let iconNewPhoto = document.getElementById('photo-add-icon');
				iconNewPhoto.style.display= "none";
				let buttonNewPhoto = document.getElementById('new-image');
				buttonNewPhoto.style.display= "none";
				let photoMaxSize = document.getElementById('photo-size');
				photoMaxSize.style.display= "none";	
				let modalEditPhoto = document.getElementById('modal-edit-new-photo');
				modalEditPhoto.style.padding = "0";
			}
		}
	});

	// Lier la fonction checkNewProjectFields() sur les 3 champs en écoutant les événements "input"
	document.getElementById('form-title').addEventListener('input', checkNewProjectFields);
	document.getElementById('form-category').addEventListener('input', checkNewProjectFields);
	document.getElementById('form-image').addEventListener('input', checkNewProjectFields);

	// Création de la fonction checkNewProjectFields() qui vérifie les champs image + titre + catégorie
	function checkNewProjectFields() {
		let title = document.getElementById('form-title');
		let category = document.getElementById('form-category');
		let image = document.getElementById('form-image');
		let submitWork = document.getElementById('submit-new-work');
		if(title.value.trim() === "" || category.value.trim() === "" || image.files.length === 0) {
			submitWork.style.backgroundColor= "#A7A7A7";
		} else {
			submitWork.style.backgroundColor= "#1D6154";
		}
	};
});

