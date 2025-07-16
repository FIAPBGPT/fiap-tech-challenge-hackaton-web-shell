// components/NotificationBell/styles.ts
import styled from 'styled-components';

export const NotificationContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
`;

export const BellButton = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #97133E; /* Cor do ícone */
  
  &:hover {
    background-color: #f3f4f6;
    color: #97133E; 
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(0.25rem, -0.25rem);
`;

export const NotificationPanel = styled.div`
  position: absolute !important;
  right: 0 !important;
  top: calc(100%) !important;
  width: 20rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  z-index: 50;
  transform-origin: top right;
  overflow: hidden;
`;


export const PanelHeader = styled.div`
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EmptyState = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
`;

export const NotificationItem = styled.div<{ unread: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: flex-start;
  background-color: ${({ unread }) => unread ? '#f0f9ff' : 'white'};
  
  &:hover {
    background-color: #f9fafb;
  }
`;

export const NotificationContent = styled.div`
  flex: 1;
  margin-left: 0.75rem;
`;

export const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
`;

export const TypeBadge = styled.span`
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #4b5563;
  text-transform: capitalize;
`;

// NotificationBellStyle.ts
export const MarkAllButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #f0f4f8;
  color: #2563eb;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e7ff;
  }

  &:active {
    background-color: #d0d7f0;
  }
`;