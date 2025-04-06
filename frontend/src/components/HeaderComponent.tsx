import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const HeaderComponent : React.FC = () =>{
    const navigate = useNavigate();
    const handleAddButtonClick = () => {
        navigate('/add');
    }
    return (
        <div className="header">
            <div className="title">
                Car Dealership
            </div>
            <div className="search-bar-container">
                <input
                type="text"
                placeholder="Search..."
                className="search-bar"
                />
                <button className='add-button' onClick={handleAddButtonClick}>Add Car</button>
            </div>
            
        </div>
    );

};

export default HeaderComponent;