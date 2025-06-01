import { TextInput } from 'react-native';

type TextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'off' | 'name' | 'email' | 'password' | 'new-password';
  secureTextEntry?: boolean;
  placeholder?: string;
};
const TextInputItem = ({
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  secureTextEntry = false,
  autoComplete,
  placeholder,
}: TextInputProps) => {
  return (
    <TextInput
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
      }}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
    />
  );
};

export default TextInputItem;
