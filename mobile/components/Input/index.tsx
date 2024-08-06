import { TextInputProps } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function Input({ ...rest }: TextInputProps) {
    return <TextInput
        className={rest.className}
        {...rest}
    />
}