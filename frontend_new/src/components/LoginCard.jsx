import { Flex, Box, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, Button, Heading, Text, useColorModeValue, Link, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { motion } from "framer-motion";

export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({ username: "", password: "" });
    const showToast = useShowToast();

    useEffect(() => {
        // Ensure body overflow is hidden when component mounts
        document.body.style.overflow = 'hidden';

        // Clean up to restore body overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            localStorage.setItem("user-threads", JSON.stringify(data));
            setUser(data);
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex align={"center"} justify={"center"} minHeight="100vh">
            <Box
                bgImage="url('/assets/background_login.png')"
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                w="100vw"
                h="100vh"
                position="absolute"
                top="0"
                left="0"
                zIndex="-1"
                opacity="0.4"
            />
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Heading fontSize={"4xl"} textAlign={"center"} color={useColorModeValue("gray.800", "white")}>
                            Login
                        </Heading>
                    </motion.div>
                    <Box
                        rounded={"lg"}
                        bg={useColorModeValue("white", "gray.700")}
                        boxShadow={"xl"}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <FormControl isRequired>
                                    <FormLabel color={useColorModeValue("gray.700", "white")}>Username</FormLabel>
                                    <Input
                                        type='text'
                                        value={inputs.username}
                                        onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
                                    />
                                </FormControl>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <FormControl isRequired>
                                    <FormLabel color={useColorModeValue("gray.700", "white")}>Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={inputs.password}
                                            onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
                                        />
                                        <InputRightElement h={"full"}>
                                            <Button
                                                variant={"ghost"}
                                                onClick={() => setShowPassword((showPassword) => !showPassword)}
                                            >
                                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            </motion.div>
                            <Stack spacing={6} pt={4}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Button
                                        size='lg'
                                        bg={"blue.400"}
                                        color={"white"}
                                        _hover={{
                                            bg: "blue.500",
                                        }}
                                        onClick={handleLogin}
                                        isLoading={loading}
                                        loadingText="Logging in"
                                    >
                                        {loading ? <Spinner size="sm" color="white" /> : "Login"}
                                    </Button>
                                </motion.div>
                            </Stack>
                            <Stack pt={4}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Text align={"center"} color={useColorModeValue("gray.600", "gray.300")}>
                                        Don't have an account?{" "}
                                        <Link color={"blue.400"} onClick={() => setAuthScreen("signup")}>
                                            Sign up
                                        </Link>
                                    </Text>
                                </motion.div>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </motion.div>
        </Flex>
    );
}