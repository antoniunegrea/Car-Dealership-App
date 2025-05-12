import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

const HeaderComponentDealerships : React.FC<HeaderProps> = ({searchTerm, setSearchTerm}) =>{
    const navigate = useNavigate();
    
    console.log("HeaderComponentDealership rendered with searchTerm:", searchTerm);

    const handleAddButtonClick = () => {
        navigate('/dealerships/add');
    }

    const handleChartsButtonClick = () =>{
        navigate('/charts');
    }

    const handleFilesButtonClick = () =>{
        navigate('/files');
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Search input changed to:", e.target.value);
        setSearchTerm(e.target.value);
    };

    return (
        <div className="header">
            <div className="title">
                Dealerships
            </div>
            <div className="search-bar-container">
                <input
                type="text"
                placeholder="Search..."
                className="search-bar"
                value={searchTerm}
                onChange={handleSearchChange}
                />
                <button className='add-button' onClick={handleAddButtonClick}>Add</button>
                <button className='charts-button' onClick={handleChartsButtonClick}>Charts</button>
                <button className='files-button' onClick={handleFilesButtonClick}>Files</button>
            </div>
            
        </div>
    );

};

export default HeaderComponentDealerships;