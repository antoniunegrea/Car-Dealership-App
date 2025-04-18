import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

const HeaderComponent : React.FC<HeaderProps> = ({searchTerm, setSearchTerm}) =>{
    const navigate = useNavigate();
    const handleAddButtonClick = () => {
        navigate('/add');
    }

    const handleChartsButtonClick = () =>{
        navigate('/charts');
    }

    const handleFilesButtonClick = () =>{
        navigate('/files');
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
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='add-button' onClick={handleAddButtonClick}>Add Car</button>
                <button className='charts-button' onClick={handleChartsButtonClick}>Charts</button>
                <button className='files-button' onClick={handleFilesButtonClick}>Files</button>
            </div>
            
        </div>
    );

};

export default HeaderComponent;