import React from 'react';
import '../../styles/customButton.css'; // Import custom CSS file for styling
import { Icon } from 'react-bootstrap-icons';

interface CustomButtonProps {
    children: React.ReactNode;
    variant: 'primary' | 'secondary';
    onClick?: () => void;
    icon?: Icon;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, variant, onClick, icon }) => {
    const className = `custom-button btn btn-${variant}`;

    return (
        <button className={className} onClick={onClick}>

            {children}
        </button>
    );
};

export default CustomButton;
