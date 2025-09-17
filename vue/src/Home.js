  import { useEffect, useState } from 'react';
  import { jwtDecode } from 'jwt-decode';
  import { useNavigate } from 'react-router-dom';

    export default function Home() {
    const [contacts, setContacts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const token = localStorage.getItem('token');
    const { userId } = jwtDecode(token);
    const [First_Name, setFirstName] = useState("");
    const [Last_Name, setLastName]   = useState("");
    const [Phone_Number, setPhoneNumber] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const fetchContacts = async () => {

        try {
            const get = await fetch(`http://localhost:8080/contact/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            }); 

            const data = await get.json();
            setContacts(Array.isArray(data) ? data : []);


        } catch (e) {
            console.error(e);
            setContacts([]); 
        }
        };

        if(userId) {
            fetchContacts();
        }
        
    },  [token, userId]);

    const handleDelete = async (contactId) => {

        try { 

          const deleteContact = await fetch(`http://localhost:8080/contact/${userId}/delete/${contactId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('Utilisateur supprimé avec succès');

        } catch (e) {

           console.error('Suppression impossible :', e.message);

        }
    }

    const handleCreateContact = async (e) => {

      e.preventDefault();

      try {
      const create = await fetch(`http://localhost:8080/contact/${userId}/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({First_Name, Last_Name, Phone_Number}),
      });

      const newContact = await create.json();

      setFirstName("");
      setLastName("");
      setPhoneNumber("");

    } catch (e) {

      console.error('Création impossible :', e.message);

    }

  }

    const startEdit = (contact) => {
      setSelectedContact(contact);
      setFirstName(contact.First_Name);
      setLastName(contact.Last_Name);
      setPhoneNumber(contact.Phone_Number);
      setIsEditing(true);

      
    };

    
    const handleUpdate = async (e) => {
    e.preventDefault(); 
    try {
      
      const update = await fetch(`http://localhost:8080/contact/${userId}/update/${selectedContact._id}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({First_Name, Last_Name, Phone_Number}),
        }
      );
    
      setIsEditing(false);
      setSelectedContact(null);
      setFirstName("");
      setLastName("");
      setPhoneNumber("");

    } catch (e) {

      console.error(e);

    }
    

  };

  const handleLogout = () => {

    localStorage.removeItem('token');
    navigate('/auth');

  };

    return (
    <div>
      <div>
        <button onClick={handleLogout}> Se déconnecter </button>
      </div>
      <h1>Mes contacts</h1>
      <ul>
        {contacts.map((c) => (
          <li key={c._id}>
            {c.First_Name} – {c.Last_Name} – {c.Phone_Number} - <button onClick={() => startEdit(c)}>Modifier</button> - <button onClick={() => handleDelete(c._id)}>Supprimer</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreateContact}>
        <div>
          <label>Prénom :</label>
          <input type="text" value={First_Name} onChange={(e) => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Nom :</label>
          <input type="text" value={Last_Name} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Téléphone :</label>
          <input type="tel" value={Phone_Number} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <button type="submit">Créer le contact</button>
      </form>
      {isEditing && (
        <div>
          <h2>Modifier le contact</h2>
          <form onSubmit={handleUpdate}>
            <input type="text" value={First_Name} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" value={Last_Name} onChange={(e) => setLastName(e.target.value)} required />
            <input type="tel" value={Phone_Number} onChange={(e) => setPhoneNumber(e.target.value)} required />
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={() => setIsEditing(false)}>Annuler</button>
          </form>
        </div>
      )}
    </div>
    );
    }