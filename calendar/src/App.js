import { Button, InstUISettingsProvider, canvas } from '@instructure/ui';
import Example from "./calendar";
import './App.css';

function App() {
  return (
    
    <div className="App">
      <header className="App-header">
        <InstUISettingsProvider theme={canvas}>
          <Example
           options={[
            { id: 'allowAll', label: 'Allow selecting of all dates' },
            { id: 'allowPrevious', label: 'Allow selecting of all previous dates' },
            { id: 'allowFuture', label: 'Allow selecting of all future dates' },
          ]}
          />
        </InstUISettingsProvider>

      </header>
    </div>
  );
}
export default App