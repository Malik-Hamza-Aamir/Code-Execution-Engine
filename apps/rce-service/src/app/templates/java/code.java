
import java.util.*;
import java.util.stream.*;

class Main {
    {{USER_CODE}}
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) continue;

            try {
                String[] tokens = Arrays.stream(line.split(","))
                                        .map(String::trim)
                                        .toArray(String[]::new);

                Object ans = {{FUNCTION_NAME}}; 
                System.out.println(ans);

            } catch (Exception e) {
                System.err.println("ERROR: " + e.getMessage());
            }
        }
    }
}
