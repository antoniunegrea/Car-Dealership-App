import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}

const HeaderComponent: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
    const navigate = useNavigate();
    
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

    const handleAddButtonClick = () => {
        navigate('/cars/add');
    }

    const handleChartsButtonClick = () => {
        navigate('/charts');
    }

    const handleFilesButtonClick = () => {
        navigate('/files');
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleDealershipsButtonClick = () => {
        navigate('/dealerships');
    }

    return (
        <div className="header">
            <div className="title">
                Toni's Car Dealership
            </div>
            <div className="search-bar-container">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search cars..."
                        className="search-bar"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <span className="search-icon">🔍</span>
                </div>
                <button className='add-button' onClick={handleAddButtonClick}>
                    <span className="button-icon"></span>Add Car
                </button>
                <button className='charts-button' onClick={handleChartsButtonClick}>
                    <span className="button-icon"></span>Charts
                </button>
                <button className='files-button' onClick={handleFilesButtonClick}>
                    <span className="button-icon"></span>Files
                </button>
                <button className='dealerships-button' onClick={handleDealershipsButtonClick}>
                    <span className="button-icon"></span>Dealerships
                </button>
                {user && user.role === 'admin' && (
                    <button className='admin-dashboard-button' onClick={() => navigate('/admin/monitored-users')}>
                        <span className="button-icon"></span>Dashboard
                    </button>
                )}
            </div>
        </div>
    );
};

export default HeaderComponent;