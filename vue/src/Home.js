    import { useEffect, useState } from 'react';
    import { jwtDecode } from 'jwt-decode';

    export default function Home() {
    const [contacts, setContacts] = useState([]);
    const token = localStorage.getItem('token');
    const { userId } = jwtDecode(token);
    

    useEffect(() => {

        const fetchContacts = async () => {

        try {
            const res = await fetch(`http://localhost:8080/contact/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
            }); 

            const data = await res.json();
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

    return (
    <div>
      <h1>Mes contacts</h1>
      <ul>
        {contacts.map((c) => (
          <li key={c._id}>
            {c.First_Name} – {c.Last_Name} – {c.Phone_Number} - <button>Modifier</button> - <button>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
    );
    }