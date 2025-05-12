import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

const HeaderComponent : React.FC<HeaderProps> = ({searchTerm, setSearchTerm}) =>{
    const navigate = useNavigate();
    
    console.log("HeaderComponent rendered with searchTerm:", searchTerm);

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

    const handleAddButtonClick = () => {
        navigate('/cars/add');
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

    const handleDealershipsButtonClick = () =>{
        navigate('/dealerships');
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
                value={searchTerm}
                onChange={handleSearchChange}
                />
                <button className='add-button' onClick={handleAddButtonClick}>Add Car</button>
                <button className='charts-button' onClick={handleChartsButtonClick}>Charts</button>
                <button className='files-button' onClick={handleFilesButtonClick}>Files</button>
                <button className='dealerships-button' onClick={handleDealershipsButtonClick}>Dealerships</button>
                {user && user.role === 'admin' && (
                    <button className='admin-dashboard-button' onClick={() => navigate('/admin/monitored-users')}>Dashboard</button>
                )}
            </div>
            
        </div>
    );

};

export default HeaderComponent;